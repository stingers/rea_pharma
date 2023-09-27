class PipeTva {
  tva(value: number, tva?: number): number {
    if (!value) {
      return null;
    }

    const getTva = tva ? tva : (tva = 0);

    return value * (getTva / 100);
  }
}
export default new PipeTva() as PipeTva;
