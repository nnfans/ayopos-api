import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 40 })
  @IsEmail()
  email: string;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 60 })
  password: string;

  @Column({ default: false })
  passwordMustChange: boolean;

  @Column({ default: false })
  isSuperUser: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
