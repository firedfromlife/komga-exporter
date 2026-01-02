export class KomgaMetrics {
  private headers: Headers;
  constructor(
    private apiUrl: string,
    private apiKey: string,
    private timeout: number,
  ) {
    this.headers = new Headers();
    this.headers.append("X-Api-Key", this.apiKey);
  }

  public async getLibraryIds(): Promise<string[]> {
    const url = `${this.apiUrl}/actuator/metrics/komga.books`;
    const response = await fetch(url, {
      headers: this.headers,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch library IDs: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.availableTags[0]?.values || [];
  }

  public async getBooksCount(libraryId?: string): Promise<number> {
    const params = libraryId ? `?tag=library:${libraryId}` : "";
    const url = `${this.apiUrl}/actuator/metrics/komga.books${params}`;
    const response = await fetch(url, {
      headers: this.headers,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch books count: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.measurements[0]?.value || 0;
  }

  public async getSeriesCount(libraryId?: string): Promise<number> {
    const params = libraryId ? `?tag=library:${libraryId}` : "";
    const url = `${this.apiUrl}/actuator/metrics/komga.series${params}`;
    const response = await fetch(url, {
      headers: this.headers,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch series count: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.measurements[0]?.value || 0;
  }

  public async getFileSize(libraryId?: string): Promise<number> {
    const params = libraryId ? `?tag=library:${libraryId}` : "";
    const url = `${this.apiUrl}/actuator/metrics/komga.books.filesize${params}`;
    const response = await fetch(url, {
      headers: this.headers,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file size: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data.measurements[0]?.value || 0;
  }

  public async getLibraries(): Promise<any[]> {
    const url = `${this.apiUrl}/api/v1/libraries`;
    const response = await fetch(url, {
      headers: this.headers,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch libraries: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  }
}
