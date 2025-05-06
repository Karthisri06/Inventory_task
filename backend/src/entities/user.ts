import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity() 
export class User {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column()
  name: string; 

  @Column({ unique: true })
  email: string; 

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: ["Admin", "Salesperson"],
    default: "Salesperson",
  })
  role: string; 

  @Column()
  store:string;

  @CreateDateColumn()
  created_at: Date; 

  @UpdateDateColumn()
  updated_at: Date; 
}
