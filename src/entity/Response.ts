import {Entity, PrimaryGeneratedColumn, Column, Timestamp} from "typeorm";

@Entity({name:'response'})
export class Response {

    @PrimaryGeneratedColumn('uuid')
    response_id:string;

    @Column({nullable:false})
    user_id:string;

    @Column({nullable:false})
    form_id:string;

    @Column({nullable:true})
    response:string;

    @Column({nullable:false})
    submitted_at:Date;

    @Column({nullable:false})
    edited_at:Date

}