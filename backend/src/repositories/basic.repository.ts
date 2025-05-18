import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  DeleteResult,
  Types,
  UpdateWriteOpResult,
  // isObjectIdOrHexString,
} from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }
  async findById(id: Types.ObjectId): Promise<T | null> {
    return this.model.findById(id);
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, {
      upsert: true,
      new: true,
    });
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async update(id: Types.ObjectId, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update);
  }

  async delete(id: Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
    return this.model.deleteOne(filter);
  }

  async find(
    filter: FilterQuery<T>,
    page: number = 1,
    limit: number = 5,
    pop:boolean=true
  ): Promise<T[]> {
    const qury = this.model.find(filter);
    if (page && limit) {
      const skip = (page - 1) * limit;
      qury.skip(skip);
    }
    if (limit) {
      qury.limit(limit);
    }
    if(pop){
      qury.populate('userid')
    }

    return qury;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findByUsernameOrEmail(value: string): Promise<T | null> {
    const filter: FilterQuery<T> = {
      $or: [{ email: value }, { username: value }],
    };

    return this.model.findOne(filter);
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T> {
    return this.model.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
  }

  async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter);
  }

  async addToSet(id: string, field: string, value: unknown): Promise<T | null> {
    const updatedDocument = await this.model.findByIdAndUpdate(
      id,
      { $addToSet: { [field]: value } } as UpdateQuery<T>,
      { new: true }
    );
    return updatedDocument as unknown as T | null;
  }

  async pull(id: string, field: string, value: unknown): Promise<T | null> {
    const updatedDocument = await this.model.findByIdAndUpdate(
      id,
      { $pull: { [field]: value } } as UpdateQuery<T>,
      { new: true }
    );
    return updatedDocument as unknown as T | null;
  }
  async getDocumentCount(filter: FilterQuery<T>): Promise<number> {
    const data = await this.model.find(filter);
    return data.length;
  }
}
