export default interface PlayerJSON {
  action: "update";
  player: {
    character: {
      crew: object[];
      display_name: string;
    };
    dbid: number;
    id: number;
  };
}
