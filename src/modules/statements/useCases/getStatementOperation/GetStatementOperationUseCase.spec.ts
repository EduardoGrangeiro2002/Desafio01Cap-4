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
import { AppError } from "../../../../shared/errors/AppError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"



let usersRepositoryInMemory: IUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let createStatement: CreateStatementUseCase
let statementRepository: IStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get Statement", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    statementRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createStatement = new CreateStatementUseCase(usersRepositoryInMemory, statementRepository)
    })

    it("Should be able to get statement by statement_id", async () => {
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
            user_id,
            type: OperationType.DEPOSIT
        }
        const statement = await createStatement.execute(statementDeposit);

        const statementReturn = await getStatementOperationUseCase.execute({user_id, statement_id: statement.id as string})


        expect(statementReturn).toHaveProperty("id")
        expect(statementReturn).toHaveProperty("type")
    })
})