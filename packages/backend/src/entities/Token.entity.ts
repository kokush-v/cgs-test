import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

@Entity()
@Unique(['userId'])
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column()
  token: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => "NOW() + INTERVAL '8000 seconds'"
  })
  expiredAt: Date;
}
