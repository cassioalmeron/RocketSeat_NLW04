import { PrimaryColumn, CreateDateColumn } from "typeorm";
import { v4 } from 'uuid'

class ModelBase{
    @PrimaryColumn()
    readonly id: string

    @CreateDateColumn()
    created_at: Date

    constructor(){
        if (!this.id){
            this.id = v4()
        }
    }
}

export default ModelBase