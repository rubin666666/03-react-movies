import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import SearchBar from "./components/SearchBar/SearchBar"
import MovieGrid from "./components/MovieGrid/MovieGrid"
import Loader from "./components/Loader/Loader"
import ErrorMessage from "./components/ErrorMessage/ErrorMessage"
import MovieModal from "./components/MovieModal/MovieModal"

import { Movie } from "./types/movie"
import { fetchMovies } from "./services/movieService"

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      setError(false)
      setMovies([])

      const data = await fetchMovies(query)

      if (data.length === 0) {
        toast.error("No movies found for your request.")
      }

      setMovies(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <Toaster position="top-right" />

      {loading && <Loader />}

      {error && <ErrorMessage />}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  )
}
