import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY // 请替换为您的TMDB API密钥
const BASE_URL = 'https://api.themoviedb.org/3'
console.log(TMDB_API_KEY)
// 创建axios实例
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'zh-CN'
  }
})

// TV相关API
export const tvApi = {
  // 获取热门电视剧
  getPopular: (page = 1) => {
    return tmdbApi.get('/tv/popular', {
      params: { page }
    })
  },

  // 获取今日播出的电视剧
  getAiringToday: (page = 1) => {
    return tmdbApi.get('/tv/airing_today', {
      params: { page }
    })
  },

  // 获取正在播出的电视剧
  getOnTheAir: (page = 1) => {
    return tmdbApi.get('/tv/on_the_air', {
      params: { page }
    })
  },

  // 获取高分电视剧
  getTopRated: (page = 1) => {
    return tmdbApi.get('/tv/top_rated', {
      params: { page }
    })
  },

  // 获取电视剧详情
  getDetails: (tvId) => {
    return tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits,created_by'
      }
    })
  }
}

// 格式化电视剧数据
export const formatTvShow = (show) => {
  return {
    id: show.id,
    title: show.name,
    originalTitle: show.original_name,
    overview: show.overview,
    posterPath: show.poster_path ? `https://image.tmdb.org/t/p/w342${show.poster_path}` : null,
    backdropPath: show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : null,
    rating: show.vote_average,
    releaseDate: show.first_air_date,
    status: show.status,
    episodeCount: show.number_of_episodes,
    seasonCount: show.number_of_seasons,
    genres: show.genres || []
  }
}

// Movie相关API
export const movieApi = {
  // 获取热门电影
  getPopular: (page = 1) => {
    return tmdbApi.get('/movie/popular', {
      params: { page }
    })
  },

  // 获取正在上映的电影
  getNowPlaying: (page = 1) => {
    return tmdbApi.get('/movie/now_playing', {
      params: { page }
    })
  },

  // 获取即将上映的电影
  getUpcoming: (page = 1) => {
    return tmdbApi.get('/movie/upcoming', {
      params: { page }
    })
  },

  // 获取高分电影
  getTopRated: (page = 1) => {
    return tmdbApi.get('/movie/top_rated', {
      params: { page }
    })
  },

  // 获取电影详情
  getDetails: (movieId) => {
    return tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits'
      }
    })
  }
}

// 格式化电影数据
export const formatMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
    backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    status: movie.status,
    runtime: movie.runtime,
    genres: movie.genres || []
  }
}