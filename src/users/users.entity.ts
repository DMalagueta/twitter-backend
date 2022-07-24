import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { TalkLineEntity } from 'src/commons/base.entity';
import { PasswordEntity } from 'src/auth/passwords.entity';

@Entity('users')
export class UserEntity extends TalkLineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ length: 50, nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 240, nullable: true })
  bio: string;

  @Column({ name: 'follower_count', default: 0 })
  followerCount: number;

  @Column({ name: 'followee_count', default: 0 })
  followeeCount: number;

  @Column('boolean', { default: false })
  verified: boolean;

  @OneToOne(() => PasswordEntity, (password) => password.user, {
    lazy: true,
    cascade: true,
  })
  userPassword: PasswordEntity;
}
