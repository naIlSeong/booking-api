import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Place } from './place.entity';

@InputType('PlaceLocationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class PlaceLocation extends CoreEntity {
  @Field((type) => [Place], { nullable: true })
  @OneToMany((type) => Place, (place) => place.placeLocation, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  places?: Place[];

  @Field((type) => String)
  @Column()
  locationName: string;

  @Field((type) => Boolean)
  @Column({ default: true })
  isAvailable: boolean;
}
