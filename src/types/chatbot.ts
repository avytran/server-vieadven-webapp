interface Metadata {
  id: string;
  source: string;
  text: string;
  chunkIndex: number;
}

interface Document {
  id: string;
  text: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export { Metadata, Document, OpenAIResponse };