export interface DatasetRow {
  [key: string]: string | number | boolean | null;
}

export interface GeneratedDataset {
  rows: DatasetRow[];
  sources: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GeneratorConfig {
  topic: string;
  fields: string[];
  rowCount: number;
}
