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

// Instrument transposition mappings - how many semitones UP the written part needs to be
// from concert pitch so that when the instrument plays it, it sounds at concert pitch
export const INSTRUMENT_TRANSPOSITIONS: Record<string, number> = {
  // Woodwinds
  'Bb Clarinet': 2,        // Written C sounds as Bb, so write D for concert C
  'Eb Alto Saxophone': 9,  // Written C sounds as Eb, so write A for concert C  
  'Bb Tenor Saxophone': 14, // Written C sounds as Bb (octave lower), so write D (octave higher)
  'Eb Baritone Saxophone': 21, // Written C sounds as Eb (octave lower)
  'Bb Soprano Saxophone': 2,   // Same as Bb Clarinet
  'F French Horn': 7,      // Written C sounds as F, so write G for concert C
  
  // Brass  
  'Bb Trumpet': 2,         // Written C sounds as Bb, so write D for concert C
  'Bb Flugelhorn': 2,      // Same as Bb Trumpet
  'Bb Trombone': 0,        // Concert pitch (bass clef)
  'Eb Tuba': 9,            // Written C sounds as Eb
  'F Tuba': 7,             // Written C sounds as F
  'Bb Euphonium': 2,       // Written C sounds as Bb
  
  // Strings (concert pitch)
  'Violin': 0,
  'Viola': 0,
  'Cello': 0,
  'Double Bass': 0,        // Written at concert pitch (bass clef)
  'Guitar': 0,             // Written at concert pitch
  'Bass Guitar': 0,        // Written at concert pitch
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
    // Generate a realistic hymn-like melody similar to "Praise to the Lord"
    interface NoteData {
      step: string;
      octave: number;
      alter?: number;
      duration?: number;
    }

    const measures = [
      // Measure 1: F-F-F-G
      { notes: [{ step: 'F', octave: 4 }, { step: 'F', octave: 4 }, { step: 'F', octave: 4 }, { step: 'G', octave: 4 }] as NoteData[] },
      // Measure 2: A-Bb-A-G
      { notes: [{ step: 'A', octave: 4 }, { step: 'B', octave: 4, alter: -1 }, { step: 'A', octave: 4 }, { step: 'G', octave: 4 }] as NoteData[] },
      // Measure 3: F-F-G-A
      { notes: [{ step: 'F', octave: 4 }, { step: 'F', octave: 4 }, { step: 'G', octave: 4 }, { step: 'A', octave: 4 }] as NoteData[] },
      // Measure 4: Bb-A-G-F
      { notes: [{ step: 'B', octave: 4, alter: -1 }, { step: 'A', octave: 4 }, { step: 'G', octave: 4 }, { step: 'F', octave: 4 }] as NoteData[] },
      // Measure 5: C-C-C-D
      { notes: [{ step: 'C', octave: 5 }, { step: 'C', octave: 5 }, { step: 'C', octave: 5 }, { step: 'D', octave: 5 }] as NoteData[] },
      // Measure 6: Eb-D-C-Bb
      { notes: [{ step: 'E', octave: 5, alter: -1 }, { step: 'D', octave: 5 }, { step: 'C', octave: 5 }, { step: 'B', octave: 4, alter: -1 }] as NoteData[] },
      // Measure 7: A-Bb-C-D
      { notes: [{ step: 'A', octave: 4 }, { step: 'B', octave: 4, alter: -1 }, { step: 'C', octave: 5 }, { step: 'D', octave: 5 }] as NoteData[] },
      // Measure 8: C-Bb (half notes for ending)
      { notes: [{ step: 'C', octave: 5, duration: 8 }, { step: 'B', octave: 4, alter: -1, duration: 8 }] as NoteData[] }
    ];

    let measuresXML = '';
    measures.forEach((measure, index) => {
      let notesXML = '';
      if (index === 0) {
        // Add attributes to first measure
        notesXML += `
      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>-1</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>`;
      }
      
      measure.notes.forEach((note: NoteData) => {
        const alter = note.alter ? `<alter>${note.alter}</alter>` : '';
        const duration = note.duration || 4;
        const noteType = duration === 8 ? 'half' : 'quarter';
        
        notesXML += `
      <note>
        <pitch>
          <step>${note.step}</step>${alter}
          <octave>${note.octave}</octave>
        </pitch>
        <duration>${duration}</duration>
        <type>${noteType}</type>
      </note>`;
      });
      
      measuresXML += `
    <measure number="${index + 1}">${notesXML}
    </measure>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>Praise to the Lord</work-title>
  </work>
  <identification>
    <creator type="composer">W.S. Bennett 1816-1875</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">${measuresXML}
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
      const keyElements = xmlDoc.querySelectorAll('key');
      keyElements.forEach(keyElement => {
        const fifthsElement = keyElement.querySelector('fifths');
        if (fifthsElement) {
          const currentFifths = parseInt(fifthsElement.textContent || '0');
          const newFifths = this.transposeKeySignature(currentFifths, semitones);
          fifthsElement.textContent = newFifths.toString();
        }
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
    // Each step around the circle of fifths represents 7 semitones
    // But for practical key signature changes, we need to map semitones to fifth changes
    const semitoneToFifthsMap: Record<number, number> = {
      0: 0,   // No change
      1: 7,   // C# major (7 sharps) - rarely used, but theoretically correct
      2: 2,   // D major (2 sharps)
      3: -3,  // Eb major (3 flats)
      4: 4,   // E major (4 sharps)
      5: -1,  // F major (1 flat)
      6: 6,   // F# major (6 sharps)
      7: 1,   // G major (1 sharp)
      8: -4,  // Ab major (4 flats)
      9: 3,   // A major (3 sharps)
      10: -2, // Bb major (2 flats)
      11: 5,  // B major (5 sharps)
      12: 0,  // Octave - same key
    };
    
    // Normalize semitones to 0-11 range
    const normalizedSemitones = ((semitones % 12) + 12) % 12;
    const fifthsChange = semitoneToFifthsMap[normalizedSemitones] || 0;
    
    // Apply the change and clamp to valid range
    const newFifths = fifths + fifthsChange;
    return Math.max(-7, Math.min(7, newFifths));
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