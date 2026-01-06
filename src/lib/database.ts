// Bolt Database Configuration and Types
// This replaces the Supabase client with Bolt's database system

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  words_learned: number;
  speaking_time_minutes: number;
  streak_days: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  session_type: 'ai_conversation' | 'translation_game' | 'speaking_practice';
  language: string;
  duration_minutes: number;
  score: number;
  completed_at: string;
  created_at: string;
}

export interface CustomerSupportRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

// Mock database implementation for Bolt
// In a real Bolt database setup, this would connect to Bolt's database service
class BoltDatabase {
  private storage: Storage;

  constructor() {
    this.storage = typeof window !== 'undefined' ? localStorage : {} as Storage;
  }

  // Utility methods
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private getStorageKey(table: string): string {
    return `bolt_db_${table}`;
  }

  private getTableData<T>(table: string): T[] {
    try {
      const data = this.storage.getItem(this.getStorageKey(table));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setTableData<T>(table: string, data: T[]): void {
    try {
      this.storage.setItem(this.getStorageKey(table), JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save to ${table}:`, error);
    }
  }

  // Generic CRUD operations
  async insert<T extends { id?: string; created_at?: string; updated_at?: string }>(
    table: string, 
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const tableData = this.getTableData<T>(table);
      const timestamp = this.getCurrentTimestamp();
      
      const newRecord = {
        ...data,
        id: this.generateId(),
        created_at: timestamp,
        updated_at: timestamp,
      } as T;

      tableData.push(newRecord);
      this.setTableData(table, tableData);

      return { data: newRecord, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async select<T>(
    table: string, 
    filters?: Partial<T>
  ): Promise<{ data: T[] | null; error: Error | null }> {
    try {
      let tableData = this.getTableData<T>(table);

      if (filters) {
        tableData = tableData.filter(record => {
          return Object.entries(filters).every(([key, value]) => {
            return (record as any)[key] === value;
          });
        });
      }

      return { data: tableData, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async selectSingle<T>(
    table: string, 
    filters: Partial<T>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const result = await this.select<T>(table, filters);
      if (result.error) return { data: null, error: result.error };
      
      const record = result.data?.[0] || null;
      return { data: record, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update<T extends { id: string; updated_at?: string }>(
    table: string, 
    id: string, 
    updates: Partial<Omit<T, 'id' | 'created_at'>>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const tableData = this.getTableData<T>(table);
      const recordIndex = tableData.findIndex(record => record.id === id);

      if (recordIndex === -1) {
        throw new Error('Record not found');
      }

      const updatedRecord = {
        ...tableData[recordIndex],
        ...updates,
        updated_at: this.getCurrentTimestamp(),
      } as T;

      tableData[recordIndex] = updatedRecord;
      this.setTableData(table, tableData);

      return { data: updatedRecord, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete<T extends { id: string }>(
    table: string, 
    id: string
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const tableData = this.getTableData<T>(table);
      const recordIndex = tableData.findIndex(record => record.id === id);

      if (recordIndex === -1) {
        throw new Error('Record not found');
      }

      const deletedRecord = tableData[recordIndex];
      tableData.splice(recordIndex, 1);
      this.setTableData(table, tableData);

      return { data: deletedRecord, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Authentication simulation
  async signUp(email: string, password: string, fullName?: string): Promise<{
    data: { user: { id: string; email: string } | null };
    error: Error | null;
  }> {
    try {
      // Check if user already exists
      const existingUser = await this.selectSingle<Profile>('profiles', { email });
      if (existingUser.data) {
        throw new Error('User already exists');
      }

      // Create user profile
      const userResult = await this.insert<Profile>('profiles', {
        email,
        full_name: fullName || '',
      });

      if (userResult.error || !userResult.data) {
        throw userResult.error || new Error('Failed to create user');
      }

      // Create initial progress record
      await this.insert<UserProgress>('user_progress', {
        user_id: userResult.data.id,
        words_learned: 0,
        speaking_time_minutes: 0,
        streak_days: 0,
        last_activity: this.getCurrentTimestamp(),
      });

      // Store current user in session
      this.storage.setItem('bolt_current_user', JSON.stringify({
        id: userResult.data.id,
        email: userResult.data.email,
      }));

      return {
        data: {
          user: {
            id: userResult.data.id,
            email: userResult.data.email,
          }
        },
        error: null
      };
    } catch (error) {
      return {
        data: { user: null },
        error: error as Error
      };
    }
  }

  async signIn(email: string, password: string): Promise<{
    data: { user: { id: string; email: string } | null };
    error: Error | null;
  }> {
    try {
      const userResult = await this.selectSingle<Profile>('profiles', { email });
      
      if (!userResult.data) {
        throw new Error('Invalid email or password');
      }

      // Store current user in session
      this.storage.setItem('bolt_current_user', JSON.stringify({
        id: userResult.data.id,
        email: userResult.data.email,
      }));

      return {
        data: {
          user: {
            id: userResult.data.id,
            email: userResult.data.email,
          }
        },
        error: null
      };
    } catch (error) {
      return {
        data: { user: null },
        error: error as Error
      };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      this.storage.removeItem('bolt_current_user');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  getCurrentUser(): { id: string; email: string } | null {
    try {
      const userData = this.storage.getItem('bolt_current_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Initialize database with sample data (for development)
  async initializeDatabase(): Promise<void> {
    // This would typically be handled by Bolt's database service
    console.log('Bolt Database initialized');
  }
}

// Export the database instance
export const boltDb = new BoltDatabase();

// Initialize database
boltDb.initializeDatabase();