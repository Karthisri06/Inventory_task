import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    static insert(records: Omit<Product, "id" | "created_at" | "updated_at">[]) {
        throw new Error("Method not implemented.");
    }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string; 

  @Column({ unique: true })
  sku: string; 

  @Column("decimal", { precision: 10, scale: 2 })
  price: number; 

  @Column()
  quantity: number; 

  @Column({ nullable: true })
  brand: string; 

  @Column({  nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
    static insertMany: any;
}
