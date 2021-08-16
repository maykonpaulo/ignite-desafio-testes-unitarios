import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to create a statement", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "teste@teste.com",
      name: "Teste",
      password: "123"
    });

    const result = await createStatementUseCase.execute({
      amount: 100,
      description: "statement test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to create a statement with non exists user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: "statement test",
        type: OperationType.DEPOSIT,
        user_id: "123"
      });

    }).rejects.toBeInstanceOf(AppError);
  });
});
