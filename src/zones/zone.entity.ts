import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    VersionColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('virtual_zones')
export class Zone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @Column()
    description: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Polygon',
        srid: 4326,
        nullable: false,
    })
    geom: any;

    @CreateDateColumn({
        type: 'timestamptz',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
    })
    updatedAt: Date;

    @VersionColumn({
        default: 1,
        nullable: false,
    })
    version: number;
}
