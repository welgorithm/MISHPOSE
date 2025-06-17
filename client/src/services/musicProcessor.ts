import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import * as Tone from 'tone';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export interface TranspositionOptions {
  sourceKey: string;
  targetInstrument: string;
  semitones: number;
}

export interface ProcessingResult {
  success: boolean;
  musicXML?: string;
  pdfBlob?: Blob;
  midiBlob?: Blob;
  error?: string;
}

// Instrument transposition mappings (semitones from concert pitch)
export const INSTRUMENT_TRANSPOSITIONS: Record<string, number> = {
  // Woodwinds
  'Bb Clarinet': 2,
  'Eb Alto Saxophone': 9,
  'Bb Tenor Saxophone': 14,
  'Eb Baritone Saxophone': 21,
  'Bb Soprano Saxophone': 2,
  'F French Horn': 7,
  
  // Brass
  'Bb Trumpet': 2,
  'Bb Flugelhorn': 2,
  'Bb Trombone': 0, // Concert pitch
  'Eb Tuba': 9,
  'F Tuba': 7,
  'Bb Euphonium': 2,
  
  // Strings (mostly concert pitch)
  'Violin': 0,
  'Viola': 0,
  'Cello': 0,
  'Double Bass': -12, // Sounds octave lower
  'Guitar': -12, // Sounds octave lower
  'Bass Guitar': -24, // Sounds two octaves lower
};

class MusicProcessor {
  private osmd: OpenSheetMusicDisplay | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.initializeOSMD();
  }

  private async initializeOSMD() {
    try {
      // Create a properly sized container for OSMD
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.style.left = '-9999px';
      this.container.style.top = '-9999px';
      this.container.style.width = '800px';
      this.container.style.height = '1200px';
      this.container.style.visibility = 'hidden';
      document.body.appendChild(this.container);

      this.osmd = new OpenSheetMusicDisplay(this.container, {
        autoResize: false,
        backend: 'svg',
        drawTitle: true,
        drawSubtitle: true,
        drawComposer: true,
        drawCredits: true,
        drawPartNames: true,
        drawMeasureNumbers: true,
        measureNumberInterval: 4,
        pageFormat: 'A4_P',
        pageBackgroundColor: '#FFFFFF',
        renderSingleHorizontalStaffline: false,
      });
      
      // Set explicit dimensions
      this.osmd.setPageFormat('A4_P');
    } catch (error) {
      console.error('Failed to initialize OSMD:', error);
    }
  }

  async processPDFToMusicXML(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // For now, we'll simulate PDF to MusicXML conversion
          // In a real implementation, you would use OCR and music recognition
          const mockMusicXML = this.generateMockMusicXML();
          resolve(mockMusicXML);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private generateMockMusicXML(): string {
    // This is a simplified MusicXML structure for demonstration
    // In production, you'd use actual music recognition from PDF
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>Sample Music</work-title>
  </work>
  <identification>
    <creator type="composer">MISHPOSE Generated</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>D</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>F</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;
  }

  async transposeMusicXML(musicXML: string, semitones: number): Promise<string> {
    try {
      // Parse the MusicXML and transpose notes
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(musicXML, 'text/xml');
      
      // Find all pitch elements and transpose them
      const pitches = xmlDoc.querySelectorAll('pitch');
      
      pitches.forEach(pitch => {
        const stepElement = pitch.querySelector('step');
        const octaveElement = pitch.querySelector('octave');
        const alterElement = pitch.querySelector('alter');
        
        if (stepElement && octaveElement) {
          const currentStep = stepElement.textContent || 'C';
          const currentOctave = parseInt(octaveElement.textContent || '4');
          const currentAlter = parseInt(alterElement?.textContent || '0');
          
          // Convert to MIDI note number for easier transposition
          const midiNote = this.noteToMidi(currentStep, currentOctave, currentAlter);
          const transposedMidi = midiNote + semitones;
          
          // Convert back to note representation
          const { step, octave, alter } = this.midiToNote(transposedMidi);
          
          stepElement.textContent = step;
          octaveElement.textContent = octave.toString();
          
          // Handle accidentals
          if (alter !== 0) {
            if (!alterElement) {
              const newAlter = xmlDoc.createElement('alter');
              newAlter.textContent = alter.toString();
              pitch.appendChild(newAlter);
            } else {
              alterElement.textContent = alter.toString();
            }
          } else if (alterElement) {
            pitch.removeChild(alterElement);
          }
        }
      });
      
      // Update key signature if needed
      const keyElements = xmlDoc.querySelectorAll('key fifths');
      keyElements.forEach(keyElement => {
        const currentFifths = parseInt(keyElement.textContent || '0');
        const newFifths = this.transposeKeySignature(currentFifths, semitones);
        keyElement.textContent = newFifths.toString();
      });
      
      // Serialize back to string
      const serializer = new XMLSerializer();
      return serializer.serializeToString(xmlDoc);
    } catch (error) {
      console.error('Error transposing MusicXML:', error);
      throw error;
    }
  }

  private noteToMidi(step: string, octave: number, alter: number = 0): number {
    const noteMap: Record<string, number> = {
      'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    };
    
    const baseNote = noteMap[step] || 0;
    return (octave + 1) * 12 + baseNote + alter;
  }

  private midiToNote(midiNote: number): { step: string, octave: number, alter: number } {
    const noteNames = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
    const alterations = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    
    return {
      step: noteNames[noteIndex],
      octave: octave,
      alter: alterations[noteIndex]
    };
  }

  private transposeKeySignature(fifths: number, semitones: number): number {
    // Circle of fifths transposition
    const circleOfFifths = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    const semitonesToFifths = Math.round(semitones * 7 / 12);
    const newFifths = Math.max(-7, Math.min(7, fifths + semitonesToFifths));
    return newFifths;
  }

  async renderToPDF(musicXML: string): Promise<Blob> {
    try {
      if (!this.osmd) {
        throw new Error('OSMD not initialized');
      }

      await this.osmd.load(musicXML);
      this.osmd.render();

      // Get the SVG elements from our container
      const svgElements = this.container?.querySelectorAll('svg') || [];
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      for (let i = 0; i < svgElements.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const svgElement = svgElements[i];
        
        // Ensure SVG has proper dimensions
        const svgEl = svgElement as SVGSVGElement;
        if (!svgEl.getAttribute('width') || !svgEl.getAttribute('height')) {
          try {
            const bbox = svgEl.getBBox();
            svgEl.setAttribute('width', bbox.width.toString());
            svgEl.setAttribute('height', bbox.height.toString());
          } catch (error) {
            // Fallback if getBBox fails
            svgEl.setAttribute('width', '800');
            svgEl.setAttribute('height', '600');
          }
        }
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const img = new Image();
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              try {
                // Set canvas dimensions with fallback
                const width = img.naturalWidth || 800;
                const height = img.naturalHeight || 600;
                
                canvas.width = width;
                canvas.height = height;
                
                // Clear canvas with white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
                
                // Draw the image
                ctx.drawImage(img, 0, 0);
                
                // Convert to PNG with error handling
                const imgData = canvas.toDataURL('image/png', 1.0);
                if (imgData && imgData !== 'data:,') {
                  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
                } else {
                  console.warn('Failed to generate valid image data, skipping page');
                }
                
                URL.revokeObjectURL(url);
                resolve();
              } catch (err) {
                URL.revokeObjectURL(url);
                reject(err);
              }
            };
            
            img.onerror = () => {
              URL.revokeObjectURL(url);
              reject(new Error('Failed to load SVG as image'));
            };
            
            img.src = url;
          });
        }
      }
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Error rendering to PDF:', error);
      // Return a simple PDF with error message instead of throwing
      const errorPdf = new jsPDF('p', 'mm', 'a4');
      errorPdf.text('Error rendering music sheet to PDF', 20, 20);
      errorPdf.text('Please try again with a different file', 20, 30);
      return errorPdf.output('blob');
    }
  }

  async generateMIDI(musicXML: string): Promise<Blob> {
    try {
      // Parse MusicXML and extract notes
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(musicXML, 'text/xml');
      const notes = xmlDoc.querySelectorAll('note');
      
      // Create a simple MIDI-like data structure
      const midiData: number[] = [];
      
      // MIDI header
      midiData.push(...[0x4D, 0x54, 0x68, 0x64]); // "MThd"
      midiData.push(...[0x00, 0x00, 0x00, 0x06]); // Header length
      midiData.push(...[0x00, 0x00]); // Format type 0
      midiData.push(...[0x00, 0x01]); // Number of tracks
      midiData.push(...[0x00, 0x60]); // Ticks per quarter note
      
      // Track header
      midiData.push(...[0x4D, 0x54, 0x72, 0x6B]); // "MTrk"
      
      const trackData: number[] = [];
      let currentTime = 0;
      
      notes.forEach(note => {
        const pitch = note.querySelector('pitch');
        if (pitch) {
          const step = pitch.querySelector('step')?.textContent || 'C';
          const octave = parseInt(pitch.querySelector('octave')?.textContent || '4');
          const alter = parseInt(pitch.querySelector('alter')?.textContent || '0');
          
          const midiNote = this.noteToMidi(step, octave, alter);
          
          // Note on
          trackData.push(0x00); // Delta time
          trackData.push(0x90); // Note on, channel 0
          trackData.push(midiNote);
          trackData.push(0x64); // Velocity
          
          // Note off (after 480 ticks)
          trackData.push(0x83, 0x60); // Delta time (480 ticks)
          trackData.push(0x80); // Note off, channel 0
          trackData.push(midiNote);
          trackData.push(0x00); // Velocity
        }
      });
      
      // End of track
      trackData.push(0x00, 0xFF, 0x2F, 0x00);
      
      // Track length
      const trackLength = trackData.length;
      midiData.push((trackLength >> 24) & 0xFF);
      midiData.push((trackLength >> 16) & 0xFF);
      midiData.push((trackLength >> 8) & 0xFF);
      midiData.push(trackLength & 0xFF);
      
      midiData.push(...trackData);
      
      return new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    } catch (error) {
      console.error('Error generating MIDI:', error);
      throw error;
    }
  }

  async processFile(
    file: File, 
    targetInstrument: string, 
    sourceKey: string = 'C'
  ): Promise<ProcessingResult> {
    try {
      // Step 1: Convert PDF to MusicXML
      const musicXML = await this.processPDFToMusicXML(file);
      
      // Step 2: Calculate transposition
      const semitones = INSTRUMENT_TRANSPOSITIONS[targetInstrument] || 0;
      
      // Step 3: Transpose the music
      const transposedXML = await this.transposeMusicXML(musicXML, semitones);
      
      // Step 4: Generate outputs
      const pdfBlob = await this.renderToPDF(transposedXML);
      const midiBlob = await this.generateMIDI(transposedXML);
      
      return {
        success: true,
        musicXML: transposedXML,
        pdfBlob,
        midiBlob
      };
    } catch (error) {
      console.error('Processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const musicProcessor = new MusicProcessor();