import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "users"})
export class User {

    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column()
    name: string;

    @Column({unique: true,nullable:true})
    google_id: string;

    @Column({unique:true,nullable:true})
    email_id: string;

    @Column({nullable:true})
    password: string;

}
