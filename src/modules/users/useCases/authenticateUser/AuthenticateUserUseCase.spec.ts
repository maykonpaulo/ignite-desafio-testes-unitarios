import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

import { AppError } from "@shared/errors/AppError";

import { ICreateUserDTO } from "../createUser/ICreateUserDTO";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      name: "user",
      password: "pass"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "not@exists.com",
        password: "password"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@test.com",
        name: "user",
        password: "pass"
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "user@test.com",
        password: "user"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
