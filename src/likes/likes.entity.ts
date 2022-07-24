import { TalkLineEntity } from 'src/commons/base.entity';
import { PostEntity } from 'src/posts/posts.entity';
import { UserEntity } from 'src/users/users.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('likes')
export class LikesEntity extends TalkLineEntity {
  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
