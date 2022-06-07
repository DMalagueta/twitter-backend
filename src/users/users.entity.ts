import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TalkLineEntity } from 'src/commons/base.entity';

@Entity('users')
export class UserEntity extends TalkLineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  avatar: string;

  @Column({ length: 240 })
  bio: string;

  @Column({ name: 'follower_count', default: 0 })
  followerCount: number;

  @Column({ name: 'followee_count', default: 0 })
  followeeCount: number;

  @Column('boolean', { default: false })
  verified: boolean;
}
