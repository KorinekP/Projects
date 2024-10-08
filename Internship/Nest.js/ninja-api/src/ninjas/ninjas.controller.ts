import { Controller, Get, Post,Put,Delete, Param, Query, Body, NotFoundException, ParseIntPipe, ValidationPipe, UseGuards } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';
import { NinjasService } from './ninjas.service';
import { BeltGuard } from 'src/belt/belt.guard';

@Controller('ninjas')
export class NinjasController {
constructor(private readonly ninjasService:NinjasService) {}
@Get()
getNinjas(@Query("weapon") weapon:"stars"|"nunchuks")
{
    return this.ninjasService.getNinjas(weapon);
}
@Get(":id")
getOneNinja(@Param("id",ParseIntPipe) id : number)
{
    try {
        return this.ninjasService.getNinja(id);
    } catch (error) {
        throw new NotFoundException();
    }

}

@Post()
@UseGuards(BeltGuard)
CreateNinja(@Body(new ValidationPipe()) CreateNinjaDto : CreateNinjaDto)
{
    return this.ninjasService.createNinja(CreateNinjaDto);
}

@Put("id")
updateNinja(@Param("id") id : string,@Body() updateNinjaDto : UpdateNinjaDto){
    return this.ninjasService.updateNinja(+id,updateNinjaDto);
}

@Delete(":id")
removeNinja(@Param("id") id : string)
{
    return this.ninjasService.removeNinja(+id);
}



}

