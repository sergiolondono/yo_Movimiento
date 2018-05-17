export class Playlist {
	constructor(
		public kind?: string,
		public etag?: string,
	    public items?: [any],
        public pageInfo?: string) {}

}