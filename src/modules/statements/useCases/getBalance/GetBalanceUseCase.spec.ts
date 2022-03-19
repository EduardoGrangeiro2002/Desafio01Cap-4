import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "src/modules/users/repositories/IUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { AppError } from "../../../../shared/errors/AppError"



let usersRepositoryInMemory: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let createStatement: CreateStatementUseCase
let statementRepository: IStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

describe("Get Statement", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementRepository, usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createStatement = new CreateStatementUseCase(usersRepositoryInMemory, statementRepository)
    })

    it("Should be able to get statement by user", async () => {
        const user: ICreateUserDTO = {
            email: "test@email.com",
            name: "User123",
            password: "senha123"
        }
        await createUserUseCase.execute(user);

        const tokenUser = await authenticateUserUseCase.execute({email: user.email, password: user.password})

        const user_id = tokenUser.user.id as string

        const statementDeposit: ICreateStatementDTO = {
            amount: 720,
            description: "Venda de app",
            user_id: tokenUser.user.id as string,
            type: OperationType.DEPOSIT
        }

        const statementWithdraw: ICreateStatementDTO = {
            amount: 500,
            description: "Venda de app",
            user_id: tokenUser.user.id as string,
            type: OperationType.WITHDRAW
        }

         await createStatement.execute(statementDeposit);
         await createStatement.execute(statementWithdraw);

        const balance = await getBalanceUseCase.execute({user_id})

        console.log(balance)

        expect(balance).toHaveProperty("statement")
        expect(balance).toHaveProperty("balance")
    })

    it("Should be not able to get statement a non-existing user", () => {
        expect(async ()=> {

            const user: ICreateUserDTO = {
                email: "test@email.com",
                name: "User123",
                password: "senha123"
            }
            await createUserUseCase.execute(user);

            await getBalanceUseCase.execute({user_id: "1214214125"})
        }).rejects.toBeInstanceOf(AppError)
    })
})