import { CreateProductInput } from '../../dto';

export class CreateProductCommand {
  constructor(public readonly createProductInput: CreateProductInput) {}
}
