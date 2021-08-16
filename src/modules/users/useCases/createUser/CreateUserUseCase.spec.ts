import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "./CreateUserUseCase";

import { AppError } from "@shared/errors/AppError";

import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      name: "user",
      password: "pass"
    };

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to create an user with exists email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "user@test.com",
        name: "user",
        password: "pass"
      });

      await createUserUseCase.execute({
        email: "user@test.com",
        name: "user 2",
        password: "pass2"
      });

    }).rejects.toBeInstanceOf(AppError);
  });
});
