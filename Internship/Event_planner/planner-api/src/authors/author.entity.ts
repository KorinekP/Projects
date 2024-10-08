import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  description: string;

  @Column()
  bornDate: Date;

  @Column("simple-array")
  specializations: string[];

  @ManyToMany(() => Event, event => event.authors)
  events: Event[];
}
