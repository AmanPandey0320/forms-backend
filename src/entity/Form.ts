import {Entity, PrimaryGeneratedColumn, Column, Timestamp} from "typeorm";

@Entity({name:'form'})
export class Form {

    @PrimaryGeneratedColumn('uuid')
    form_id:string;

    @Column({default:'Untitled form'})
    title:string;

    @Column({default:0})
    theme:Number;

    @Column({nullable:true})
    data:string;

    @Column({default:false})
    istest:boolean;

    @Column({nullable:true})
    duration:Number;

    @Column({nullable:true})
    ans_key:string;

    @Column({nullable:false})
    user_id:string;

    @Column({nullable:true})
    description:string;

    @Column({nullable:false})
    created_at:Date;

}