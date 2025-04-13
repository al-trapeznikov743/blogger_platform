export class Repository<T extends {id: string}, TInput extends Partial<T> = Partial<T>> {
  constructor(
    private db: Record<string, any>,
    private collectionKey: string
  ) {
    if (!db[collectionKey]) {
      throw new Error(`Collection '${collectionKey}' does not exist`);
    }

    this.collectionKey = collectionKey;
  }

  get collection(): T[] {
    return this.db[this.collectionKey];
  }

  findAll(): T[] {
    return this.collection;
  }

  findById(id: string): T | null {
    return this.collection.find((item) => item.id === id) ?? null;
  }

  create(newItem: T): T {
    this.collection.push(newItem);

    return newItem;
  }

  update(id: string, dto: TInput): void {
    const index = this.collection.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.collection[index] = {
      ...this.collection[index],
      ...dto
    };
  }

  delete(id: string): void {
    const index = this.collection.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Entity not found');
    }

    this.collection.splice(index, 1);
  }
}
