import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Author } from '../authors/author.entity';
import { User } from '../users/user.entity';
import { Reaction } from 'src/reaction/reaction.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateFrom: Date;

  @Column()
  dateTo: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: Number;  

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @ManyToMany(() => Author, author => author.events, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  @JoinTable()
  authors: Author[];

  @OneToMany(() => Reaction, reaction => reaction.event,)
  reactions: Reaction[];
}
