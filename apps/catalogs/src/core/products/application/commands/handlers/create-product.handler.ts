import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommandProductRepository } from '../../../infrastructure';
import { CreateProductCommand } from '../impl';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly repository: CommandProductRepository) {}

  async execute(command: CreateProductCommand): Promise<any> {
    const { createProductInput } = command;
    return await this.repository.create(createProductInput);
  }
}
