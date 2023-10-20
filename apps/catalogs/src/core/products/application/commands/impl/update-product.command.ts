import { UpdateProductInput } from '../../dto';

export class UpdateProductCommand {
  constructor(
    public readonly productId: number,
    public readonly updateProductInput: UpdateProductInput,
  ) {}
}
