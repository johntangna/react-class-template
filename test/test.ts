enum CooperationEnum {
  NOT_FOLLOWED_UP = "未跟进",
  FOLLOWED_UP = '已跟进',
  ESTABLISHED = '已确立',
}

describe("test", () => {
  it("test", () => {
    const value = "FOLLOWED_UP"
    console.log(CooperationEnum[value])
  });
});