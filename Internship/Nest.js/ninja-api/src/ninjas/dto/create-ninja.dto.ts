import { MinLength, IsEnum } from "class-validator";

export class CreateNinjaDto {
    @MinLength(3)
    name:string;


    @IsEnum(["stars","nunchuks"],{message : "USe stars or nunchucks"})
    weapon: "stars" | "nunchuks";
}
