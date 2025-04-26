import { SimpleVectorDB } from './vectordb';
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openAi = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Create vector database instance
const vectorDb = new SimpleVectorDB('vieadven_vectordb');

async function generateEmbeddings(text: string): Promise<number[]> {
  const response = await openAi.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  });
  return response.data[0].embedding;
}

async function loadDocumentsFromDirectory(directoryPath: string): Promise<void> {
  try {
    await vectorDb.initialize();

    // Get list of files in directory
    const files = await fs.readdir(directoryPath);
    console.log('Processing documents...');

    // Process files concurrently
    await Promise.all(files.map(async file => {
      if (file.endsWith('.txt') || file.endsWith('.md')) {
        const filePath = path.join(directoryPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        const chunks = SimpleVectorDB.chunkText(content);
        console.log(`Processing ${file}: created ${chunks.length} chunks`);

        // Process all chunks concurrently
        const chunkPromises = chunks.map(async (rawChunk, i) => {
          const chunk = rawChunk.replace(/[\n\r\t]+/g, ' ');
          const id = `${path.basename(file, path.extname(file))}_${i}`;
          const embedding = await generateEmbeddings(chunk);
          vectorDb.addVector(id, embedding, {
            id,
            source: file,
            text: chunk,
            chunkIndex: i
          });
          console.log(`Added chunk ${i + 1}/${chunks.length} for ${file}`);
        });
        await Promise.all(chunkPromises);
      }
    }));

    await vectorDb.save();
    console.log(`Successfully processed ${files.length} files.`);
  } catch (error) {
    console.error("Error loading documents:", error);
  }
}

loadDocumentsFromDirectory(path.join(__dirname, 'data'));

console.log("Vector database stats:", vectorDb.getStats());

export { loadDocumentsFromDirectory };