import { Application } from "@oak/oak";
import { Config } from "./src/Config.ts";
import { KomgaMetrics } from "./src/KomgaMetrics.ts";
import "@std/dotenv/load";

const app = new Application();
Config.API_KEY = Deno.env.get("API_KEY") || Config.API_KEY;
Config.API_URL = Deno.env.get("API_URL") || Config.API_URL;
Config.PORT = parseInt(Deno.env.get("PORT") || "") || Config.PORT;
Config.TIMEOUT = parseInt(Deno.env.get("TIMEOUT") || "") ||
  Config.TIMEOUT;

const komgaMetrics = new KomgaMetrics(
  Config.API_URL,
  Config.API_KEY,
  Config.TIMEOUT,
);

app.use(async (ctx) => {
  if (ctx.request.url.pathname !== "/metrics") {
    ctx.response.status = 404;
    ctx.response.body = "Not Found";
    return;
  }
  try {
    let responseText = "";
    const libraryIds = await komgaMetrics.getLibraryIds();
    const libraries = await komgaMetrics.getLibraries();
    // console.log(libraries);

    const totalBooks = await komgaMetrics.getBooksCount();
    responseText += `# HELP komga_books_total Total number of books in Komga\n`;
    responseText += `# TYPE komga_books_total gauge\n`;
    responseText += `komga_books_total ${totalBooks}\n`;

    const totalSeries = await komgaMetrics.getSeriesCount();
    responseText +=
      `# HELP komga_series_total Total number of series in Komga\n`;
    responseText += `# TYPE komga_series_total gauge\n`;
    responseText += `komga_series_total ${totalSeries}\n`;
    const totalFileSize = await komgaMetrics.getFileSize();
    responseText +=
      `# HELP komga_files_size_bytes Total file size of all books in Komga in bytes\n`;
    responseText += `# TYPE komga_files_size_bytes gauge\n`;
    responseText += `komga_files_size_bytes ${totalFileSize}\n`;
    let booksCountText =
      "# HELP komga_books_in_library_total Total number of books in a Komga library\n# TYPE komga_books_in_library_total gauge\n";
    let seriesCountText =
      "# HELP komga_series_in_library_total Total number of series in a Komga library\n# TYPE komga_series_in_library_total gauge\n";
    let fileSizeText =
      "# HELP komga_files_in_library_size_bytes Total file size of all books in a Komga library in bytes\n# TYPE komga_files_in_library_size_bytes gauge\n";
    for (const libraryId of libraryIds) {
      const library = libraries.find((lib) => lib.id === libraryId);

      const booksCount = await komgaMetrics.getBooksCount(libraryId);
      booksCountText +=
        `komga_books_in_library_total{library_id="${libraryId}",library_name="${library?.name}"} ${booksCount}\n`;
      const seriesCount = await komgaMetrics.getSeriesCount(libraryId);
      seriesCountText +=
        `komga_series_in_library_total{library_id="${libraryId}",library_name="${library?.name}"} ${seriesCount}\n`;
      const fileSize = await komgaMetrics.getFileSize(libraryId);
      fileSizeText +=
        `komga_files_in_library_size_bytes{library_id="${libraryId}",library_name="${library?.name}"} ${fileSize}\n`;
    }
    responseText += booksCountText;
    responseText += seriesCountText;
    responseText += fileSizeText;

    ctx.response.headers.set("Content-Type", "text/plain");
    ctx.response.status = 200;
    ctx.response.body = responseText;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = `Error: ${error}`;
    return;
  }
});

console.log(`Export is running on port ${Config.PORT}`);
console.log(`Komga URL: ${Config.API_URL}`);

await app.listen({ port: Config.PORT });