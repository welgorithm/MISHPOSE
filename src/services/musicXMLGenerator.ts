export interface Note {
  pitch: string;
  duration: string;
  octave?: number;
  alter?: number;
}

export interface Measure {
  notes: Note[];
  timeSignature?: string;
  keySignature?: string;
}

export interface MusicData {
  measures: Measure[];
  metadata: {
    title: string;
    composer: string;
    keySignature: string;
    timeSignature: string;
  };
}

export class MusicXMLGenerator {
  generateMusicXML(musicData: MusicData): string {
    const { measures, metadata } = musicData;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${metadata.title}</work-title>
  </work>
  <identification>
    <creator type="composer">${metadata.composer}</creator>
    <encoding>
      <software>MISHPOSE Music Transposer</software>
      <encoding-date>${new Date().toISOString().split('T')[0]}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">`;

    measures.forEach((measure, index) => {
      xml += `
    <measure number="${index + 1}">`;
      
      if (index === 0) {
        xml += `
      <attributes>
        <divisions>4</divisions>
        <key>
          <fifths>${this.keyToFifths(metadata.keySignature)}</fifths>
        </key>
        <time>
          <beats>${metadata.timeSignature.split('/')[0]}</beats>
          <beat-type>${metadata.timeSignature.split('/')[1]}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>`;
      }

      measure.notes.forEach(note => {
        const { step, octave, alter } = this.parsePitch(note.pitch);
        xml += `
      <note>
        <pitch>
          <step>${step}</step>`;
        
        if (alter !== 0) {
          xml += `
          <alter>${alter}</alter>`;
        }
        
        xml += `
          <octave>${octave}</octave>
        </pitch>
        <duration>${this.durationToTicks(note.duration)}</duration>
        <type>${note.duration}</type>
      </note>`;
      });

      xml += `
    </measure>`;
    });

    xml += `
  </part>
</score-partwise>`;

    return xml;
  }

  private parsePitch(pitch: string): { step: string, octave: number, alter: number } {
    const match = pitch.match(/([A-G])([#b]?)(\d+)/);
    if (!match) {
      return { step: 'C', octave: 4, alter: 0 };
    }

    const [, step, accidental, octaveStr] = match;
    const octave = parseInt(octaveStr);
    let alter = 0;

    if (accidental === '#') alter = 1;
    else if (accidental === 'b') alter = -1;

    return { step, octave, alter };
  }

  private keyToFifths(key: string): number {
    const keyMap: Record<string, number> = {
      'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6, 'C#': 7,
      'F': -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7
    };
    return keyMap[key] || 0;
  }

  private durationToTicks(duration: string): number {
    const durationMap: Record<string, number> = {
      'whole': 16,
      'half': 8,
      'quarter': 4,
      'eighth': 2,
      'sixteenth': 1
    };
    return durationMap[duration] || 4;
  }
}

export const musicXMLGenerator = new MusicXMLGenerator();