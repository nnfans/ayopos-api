import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  category: string;

  @Column({ length: 40 })
  name: string;

  @Column({ type: 'money' })
  cost: number;

  @Column({ type: 'money' })
  price: number;

  @Column({ type: 'int' })
  qty: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ type: 'int' })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
