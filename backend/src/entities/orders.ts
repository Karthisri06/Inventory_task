import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../entities/user";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User; 

  @Column({ type: "json" })
  items: object[]; 

  @Column("decimal", { precision: 10, scale: 2 })
  total_amount: number; 

  @Column({
    type: "enum",
    enum: ["Pending", "Processed",  "Canceled"],
    default: "Pending",
  })
  status: string; 

  @Column()
  store:string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}