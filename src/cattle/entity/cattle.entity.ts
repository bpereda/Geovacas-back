import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Zone } from '../../zones/zone.entity';

@Entity('cattle')
export class Cattle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'text', unique: true, name: 'device_id' })
    deviceId: string;

    @CreateDateColumn({
        nullable: false,
        type: 'timestamptz',
        name: 'created_at',
    })
    createdAt: Date;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: any;

    @UpdateDateColumn({
        nullable: false,
        type: 'timestamptz',
        name: 'updated_at',
    })
    updatedAt: Date;

    @ManyToOne(() => Zone, { eager: true })
    @JoinColumn({ name: 'zone_id', foreignKeyConstraintName: 'ZONE_FK' })
    zone: Zone;
}
