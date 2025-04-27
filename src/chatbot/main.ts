import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { SimpleVectorDB } from './vectordb';
import dotenv from 'dotenv';
import { Metadata } from '../types/chatbot';
import { Document } from '../types/chatbot';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openAi = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Create a vector database instance
const vectorDb = new SimpleVectorDB('vieadven_vectordb');

// Load or initialize vector database and resources
async function initializeDatabase(): Promise<void> {
  try {
    console.log("Initializing vector database...");

    // Initialize the vector database
    await vectorDb.initialize();

    // Check if we need to import existing data
    if (vectorDb.vectors.length === 0) {
      console.log("Vector database is empty, importing existing data...");
      await importExistingData();
    }
    console.log("Vector database initialized successfully!");
    console.log("Database stats:", vectorDb.getStats());
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Import existing embeddings and documents
async function importExistingData(): Promise<void> {
  try {
    const embeddingsPath = path.join(__dirname, 'data', 'vectordb', 'embeddings.json');
    const documentsPath = path.join(__dirname, 'data', 'vectordb', 'documents.json');

    if (!(await fs.stat(embeddingsPath).catch(() => false))) {
      throw new Error(`File not found: ${embeddingsPath}`);
    }

    if (!(await fs.stat(documentsPath).catch(() => false))) {
      throw new Error(`File not found: ${documentsPath}`);
    }

    const embeddingsData = await fs.readFile(embeddingsPath, 'utf8');
    const documentEmbeddings = JSON.parse(embeddingsData);

    const documentsData = await fs.readFile(documentsPath, 'utf8');
    const documents = JSON.parse(documentsData);

    for (const document of documents) {
      const docId = document.id;
      const embedding = documentEmbeddings[docId];

      if (!embedding) {
        console.warn(`Warning: No embedding found for document ${docId}`);
        continue;
      }

      vectorDb.addVector(docId, embedding, document);
    }

    await vectorDb.save();
    console.log(`Imported ${documents.length} documents into vector database`);
  } catch (error) {
    console.error("Error importing existing data:", error);
    throw error;
  }
}

// Generate embeddings for a text
async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openAi.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

// Add a new document to the vector database
async function addDocument(document: Document): Promise<boolean> {
  try {
    // Generate embedding for the document
    const embedding = await generateEmbeddings(document.text);

    const metadata: Metadata = {
      id: document.id,      // Add the 'id' property
      text: document.text,  // Add the 'text' property
      source: document.id,  // Map 'id' to 'source' (adjust as needed)
      chunkIndex: 0         // Default value or derive from the document
    };

    // Add to vector database
    vectorDb.addVector(document.id, embedding, metadata);

    // Save the updated database
    await vectorDb.save();

    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
}

// Find relevant documents for a query
async function findRelevantDocuments(query: string, limit = 3): Promise<Metadata[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbeddings(query);

    // Find similar documents
    const results = vectorDb.findSimilar(queryEmbedding, limit);
    console.log(results);
    return results.map(result => result.metadata as Metadata);
  } catch (error) {
    console.error("Error finding relevant documents:", error);
    return [];
  }
}

// Main chatbot response function
async function getChatbotResponse(userMessage: string): Promise<string> {
  try {
    let prevMessages = [
      {
        "role": "system",
        "content": "Xin chào! Tôi là chatbot về văn hóa Việt Nam. Tôi có thể giúp gì cho bạn?"
      },
      {
        "role": "user",
        "content": "Bạn có thể kể về 1 tỉnh thành không?"
      },
      {
        "role": "system",
        "content": "Bạn muốn biết về tỉnh thành nào? Ví dụ: Lạng Sơn, Hà Giang, hay Cao Bằng?"
      }
    ];

    const conversationContext = prevMessages.map(msg => msg.role + ":" + msg.content);

    // Find the most relevant documents
    const relevantDocs = await findRelevantDocuments(userMessage, 2);
    const context = relevantDocs.map(doc => doc.text).join("\n");

    const response = await openAi.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "developer",
          content: `
          Bạn là một trợ lý chuyên gia về văn hóa Việt Nam. Bạn cung cấp thông tin chính xác, thân thiện và ngắn gọn về lịch sử, địa danh, phong tục, và các trò chơi dân gian của Việt Nam.
          Sử dụng ngữ cảnh sau từ cơ sở dữ liệu để trả lời: ${context}.
          Đây là lịch sử hội thoại: ${prevMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}.
          `,
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (response.choices?.[0]?.message?.content) {
      return response.choices[0].message.content;
    } else {
      throw new Error("Invalid response structure from OpenAI API");
    }
  } catch (error) {
    console.error("Error in chatbot response:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
}

// Initialize database when module loads
(async () => {
  await initializeDatabase()
    .then(() => console.log("Ready to answer questions!"))
    .catch(err => console.error("Failed to initialize:", err));

  // Test the chatbot
  // getChatbotResponse('Bạn có thể kể về tỉnh Cao Bằng không?')
  //   .then(response => console.log({
  //     "Question:": 'Bạn có thể kể về tỉnh Cao Bằng không?',
  //     "Response:": response
  //   }));
})();
(async () => {
  try {
    console.log("Saving vectors to file...");
    await vectorDb.save();
    console.log("Vectors saved successfully!");
  } catch (error) {
    console.error("Error saving vectors to file:", error);
  }
})();
export {
  getChatbotResponse,
  findRelevantDocuments,
  vectorDb
};