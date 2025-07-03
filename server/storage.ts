import fs from 'fs';
import path from 'path';
import { System, InsertSystem } from '@shared/schema';

export interface IStorage {
  getSystems(): Promise<System[]>;
  getSystem(id: string): Promise<System | undefined>;
  createSystem(system: InsertSystem): Promise<System>;
  updateSystem(id: string, system: Partial<InsertSystem>): Promise<System | undefined>;
  deleteSystem(id: string): Promise<boolean>;
}

export class JsonFileStorage implements IStorage {
  private dbPath: string;

  constructor() {
    this.dbPath = path.resolve(process.cwd(), 'db_data.json');
    this.initializeDb();
  }

  private initializeDb() {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({ systems: [] }, null, 2));
    }
  }

  private readData(): { systems: System[] } {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database file:', error);
      return { systems: [] };
    }
  }

  private writeData(data: { systems: System[] }): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing to database file:', error);
      throw error;
    }
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `SYS-${timestamp}-${randomStr}`.toUpperCase();
  }

  async getSystems(): Promise<System[]> {
    const data = this.readData();
    return data.systems;
  }

  async getSystem(id: string): Promise<System | undefined> {
    const data = this.readData();
    return data.systems.find(system => system.system_id === id);
  }

  async createSystem(insertSystem: InsertSystem): Promise<System> {
    const data = this.readData();
    const now = new Date().toISOString();
    
    const newSystem: System = {
      ...insertSystem,
      system_id: this.generateId(),
      created_at: now,
      updated_at: now,
      status: insertSystem.status || 'active',
    };

    data.systems.push(newSystem);
    this.writeData(data);
    
    return newSystem;
  }

  async updateSystem(id: string, updateData: Partial<InsertSystem>): Promise<System | undefined> {
    const data = this.readData();
    const systemIndex = data.systems.findIndex(system => system.system_id === id);
    
    if (systemIndex === -1) {
      return undefined;
    }

    const updatedSystem: System = {
      ...data.systems[systemIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    data.systems[systemIndex] = updatedSystem;
    this.writeData(data);
    
    return updatedSystem;
  }

  async deleteSystem(id: string): Promise<boolean> {
    const data = this.readData();
    const systemIndex = data.systems.findIndex(system => system.system_id === id);
    
    if (systemIndex === -1) {
      return false;
    }

    data.systems.splice(systemIndex, 1);
    this.writeData(data);
    
    return true;
  }
}

export const storage = new JsonFileStorage();
