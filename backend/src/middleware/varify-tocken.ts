import { NextFunction, Request, Response } from "express";

export function tockenValidaion(role:'admin'|'user'):(req:Request,res:Response,next:NextFunction)=>void{
    return (req:Request,res:Response,next:NextFunction)=>{

    }
}