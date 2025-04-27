import fs from 'fs/promises';
import path from 'path';
import { Metadata } from '../types/chatbot';

/**
 * SimpleVectorDB - A lightweight vector database for RAG applications
 * 
 * This class provides:
 * - Storage for document embeddings and metadata
 * - Efficient vector similarity search
 * - Persistence to disk
 * - Document chunking capabilities
 */
class SimpleVectorDB {
  vectors: { id: string; embedding: number[]; metadata: Metadata }[]; // Mảng chứa các vector
  initialized: boolean;
  dbPath: string;
  db_name: string;

  constructor(db_name) {
    this.vectors = []; // Array of {id, embedding, metadata} objects
    this.initialized = false;
    this.dbPath = path.join(__dirname, 'data', 'vectordb');
    this.db_name = db_name;
  }

  /**
   * Initialize the vector database, creating storage directory if needed
   */
  async initialize(): Promise<boolean> {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dbPath, { recursive: true });
      this.initialized = true;

      // Try to load existing data
      try {
        await this.load();
      } catch (error) {
        // If no existing data, this is fine - we'll start fresh
        console.log("No existing vector database found, starting fresh.");
      }

      return true;
    } catch (error) {
      console.error("Failed to initialize vector database:", error);
      return false;
    }
  }

  /**
   * Add a document with its embedding to the database
   * @param {string} id - Unique identifier for the document
   * @param {Array<number>} embedding - The vector embedding of the document
   * @param {Object} metadata - Additional document data (text, question, answer, etc.)
   */
  addVector(id: string, embedding: number[], metadata: Metadata): void {
    // Check if document with this ID already exists
    console.log("Current vectors:", this.vectors);
    if (!Array.isArray(this.vectors)) {
      throw new Error("this.vectors is not an array");
    }
    const existingIndex = this.vectors.findIndex(v => v.id === id);

    if (existingIndex >= 0) {
      // Update existing document
      this.vectors[existingIndex] = { id, embedding, metadata };
    } else {
      // Add new document
      this.vectors.push({ id, embedding, metadata });
    }
  }

  /**
   * Add multiple vectors at once
   * @param {Array<Object>} vectors - Array of {id, embedding, metadata} objects
   */
  addVectors(vectors: { id: string; embedding: number[]; metadata: Metadata }[]): void {
    for (const vector of vectors) {
      this.addVector(vector.id, vector.embedding, vector.metadata);
    }
  }

  /**
   * Remove a document from the database
   * @param {string} id - ID of the document to remove
   * @returns {boolean} - Whether removal was successful
   */
  removeVector(id: string): boolean {
    const initialLength = this.vectors.length;
    this.vectors = this.vectors.filter(v => v.id !== id);
    return initialLength !== this.vectors.length;
  }

  /**
   * Find the most similar documents to a query embedding
   * @param {Array<number>} queryEmbedding - The embedding of the query
   * @param {number} limit - Maximum number of results to return
   * @param {number} minSimilarity - Minimum similarity score to include in results
   * @returns {Array<Object>} - Array of {id, similarity, metadata} objects
   */
  findSimilar(queryEmbedding: number[], limit = 5, minSimilarity: number | null = null): { id: string; similarity: number; metadata: Metadata }[] {
    // Calculate similarity for all vectors
    const results = this.vectors.map(vector => {
      const similarity = this.calculateSimilarity(queryEmbedding, vector.embedding);
      return {
        id: vector.id,
        similarity,
        metadata: vector.metadata
      };
    });

    // Sort by highest similarity (lowest distance)
    results.sort((a, b) => a.similarity - b.similarity);

    // Apply minimum similarity filter if specified
    let filteredResults = results;
    if (minSimilarity !== null) {
      filteredResults = results.filter(result => result.similarity <= minSimilarity);
    }

    // Return top results
    return filteredResults.slice(0, limit);
  }

  /**
   * Calculate similarity between two vectors using Euclidean distance
   * (Lower values mean higher similarity)
   * @param {Array<number>} vecA - First vector
   * @param {Array<number>} vecB - Second vector
   * @returns {number} - Similarity score (distance)
   */
  calculateSimilarity(vecA: number[], vecB: number[]): number {
    return Math.sqrt(vecA.reduce((sum, a, i) => sum + (a - vecB[i]) ** 2, 0));
  }

  /**
   * Get a specific document by ID
   * @param {string} id - Document ID to retrieve
   * @returns {Object|null} - The document or null if not found
   */
  getById(id: string): { id: string; metadata: Metadata } | null {
    const vector = this.vectors.find(v => v.id === id);
    return vector ? { id: vector.id, metadata: vector.metadata } : null;
  }

  /**
   * Save the vector database to disk
   * @returns {Promise<boolean>} - Whether the save was successful
   */
  async save(): Promise<boolean> {
    try {
      if (!this.initialized) await this.initialize();

      // Save vectors to a JSON file
      const filePath = path.join(this.dbPath, this.db_name + '.json');
      console.log("Saving vectors to file:", filePath);

      const jsonData = JSON.stringify(this.vectors, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');

      console.log("Vectors saved successfully.");
      return true;
    } catch (error) {
      console.error("Failed to save vector database:", error);
      return false;
    }
  }

  /**
   * Load the vector database from disk
   * @returns {Promise<boolean>} - Whether the load was successful
   */
  async load(): Promise<boolean> {
    try {
      if (!this.initialized) await this.initialize();

      // Load vectors from JSON file
      const data = await fs.readFile(
        path.join(this.dbPath, this.db_name + '.json'),
        'utf8'
      );

      this.vectors = JSON.parse(data);
      return true;
    } catch (error) {
      console.error("Failed to load vector database:", error);
      throw error;
    }
  }

  /**
   * Split a text document into smaller chunks for embedding
   * @param {string} text - The text to split
   * @param {number} chunkSize - Maximum chunk size in characters
   * @param {number} overlap - Overlap between chunks in characters
   * @returns {Array<string>} - Array of text chunks
   */
  static chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
    const chunks: string[] = [];

    if (text.length <= chunkSize) {
      return [text];
    }

    for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
      // Make sure we don't go past the end of the text
      const end = Math.min(i + chunkSize, text.length);
      // Make chunks that break at sentence or paragraph boundaries when possible
      let chunkEnd = end;

      // Try to find a paragraph break
      const paragraphBreak = text.lastIndexOf('\n\n', end);
      if (paragraphBreak > i && paragraphBreak > end - 200) {
        chunkEnd = paragraphBreak;
      } else {
        // Try to find a sentence break
        const sentenceBreak = Math.max(
          text.lastIndexOf('. ', end),
          text.lastIndexOf('! ', end),
          text.lastIndexOf('? ', end)
        );

        if (sentenceBreak > i && sentenceBreak > end - 100) {
          chunkEnd = sentenceBreak + 1; // Include the period
        }
      }

      chunks.push(text.substring(i, chunkEnd).trim());

      // If we've reached the end of the text, stop
      if (end === text.length) break;
    }

    return chunks;
  }

  /**
   * Get statistics about the vector database
   * @returns {Object} - Statistics object
   */
  getStats(): { totalDocuments: number; categoryBreakdown: Record<string, number>; vectorDimension: number } {
    const categoryCount: Record<string, number> = {};

    // Count documents by category
    for (const vector of this.vectors) {
      const category = vector.id.split('_')[0]; // Assuming IDs are prefixed with category
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }

    return {
      totalDocuments: this.vectors.length,
      categoryBreakdown: categoryCount,
      vectorDimension: this.vectors.length > 0 ? this.vectors[0].embedding.length : 0
    };
  }
}

export { SimpleVectorDB };