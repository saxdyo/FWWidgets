"""
Demonstration script showcasing advanced optimization features.
This script demonstrates all the optimizations inspired by fw2.js.
"""

import os
import time
import json
from datetime import datetime
from typing import Dict, List, Any

# Import all optimization modules
try:
    from tmdb_client import TMDBClient
    from advanced_cache import cache_manager
    from enhanced_network import global_session, CDNRegion
    from concurrency_manager import network_concurrency_manager, TaskPriority
    from content_filter import default_content_filter, chinese_optimizer
    from enhanced_image_processor import global_image_processor, OPTIMIZATION_CONFIGS
    from title_overlay_generator import title_overlay_generator, OVERLAY_CONFIGS
    from data_health_monitor import global_health_monitor
    
    print("✓ All optimization modules loaded successfully!")
    OPTIMIZATIONS_AVAILABLE = True
except ImportError as e:
    print(f"⚠ Some optimization modules not available: {e}")
    OPTIMIZATIONS_AVAILABLE = False


def demonstrate_enhanced_tmdb_client():
    """Demonstrate enhanced TMDB client with all optimizations"""
    print("\n" + "="*60)
    print("🚀 ENHANCED TMDB CLIENT DEMONSTRATION")
    print("="*60)
    
    if not OPTIMIZATIONS_AVAILABLE:
        print("⚠ Optimizations not available, using basic client")
        client = TMDBClient(enable_optimizations=False)
    else:
        client = TMDBClient(enable_optimizations=True)
    
    # Test different endpoint calls
    print("\n📋 Testing API calls with caching and filtering...")
    
    start_time = time.time()
    
    # Get popular movies (will be cached and filtered)
    popular_movies = client.get_popular_movies(apply_filters=True)
    print(f"✓ Popular movies: {len(popular_movies)} items")
    
    # Get trending movies (will use different cache)
    trending_movies = client.get_trending_movies('day', apply_filters=True)
    print(f"✓ Trending movies: {len(trending_movies)} items")
    
    # Get movies with backdrops (uses concurrent processing if optimizations enabled)
    backdrop_movies = client.get_movies_with_backdrops(limit=20, apply_filters=True)
    print(f"✓ Movies with backdrops: {len(backdrop_movies)} items")
    
    end_time = time.time()
    print(f"⏱ Total API calls completed in {end_time - start_time:.2f} seconds")
    
    # Show performance metrics if available
    if OPTIMIZATIONS_AVAILABLE:
        print("\n📊 Performance Metrics:")
        metrics = client.get_performance_metrics()
        
        cache_stats = metrics.get('cache_stats', {})
        for cache_type, stats in cache_stats.items():
            if stats.get('current_size', 0) > 0:
                hit_rate = stats.get('hit_rate', 0) * 100
                print(f"  🗄 {cache_type}: {stats.get('current_size', 0)} items, {hit_rate:.1f}% hit rate")
        
        concurrency_metrics = metrics.get('concurrency_metrics', {})
        if concurrency_metrics.get('total_tasks', 0) > 0:
            success_rate = concurrency_metrics.get('success_rate', 0) * 100
            print(f"  ⚡ Concurrency: {concurrency_metrics.get('completed_tasks', 0)} tasks, {success_rate:.1f}% success rate")
    
    return backdrop_movies


def demonstrate_content_filtering():
    """Demonstrate content filtering capabilities"""
    print("\n" + "="*60)
    print("🔍 CONTENT FILTERING DEMONSTRATION")
    print("="*60)
    
    if not OPTIMIZATIONS_AVAILABLE:
        print("⚠ Content filtering not available")
        return []
    
    # Create some sample movie data (simulating TMDB response)
    sample_movies = [
        {
            "id": 1,
            "title": "Avengers: Endgame",
            "media_type": "movie",
            "genre_ids": [28, 12, 878],  # Action, Adventure, Sci-Fi
            "vote_average": 8.4,
            "vote_count": 15000,
            "overview": "Epic superhero movie",
            "backdrop_path": "/sample1.jpg"
        },
        {
            "id": 2,
            "title": "综艺大观 - Variety Show",
            "media_type": "tv",
            "genre_ids": [10764],  # Reality TV
            "vote_average": 6.5,
            "vote_count": 100,
            "overview": "Popular variety show with entertainment",
            "backdrop_path": "/sample2.jpg"
        },
        {
            "id": 3,
            "title": "短剧系列 - Short Drama",
            "media_type": "tv",
            "genre_ids": [18],  # Drama
            "vote_average": 5.5,
            "vote_count": 50,
            "overview": "Short web drama series",
            "number_of_episodes": 8,
            "episode_run_time": [15],
            "backdrop_path": "/sample3.jpg"
        },
        {
            "id": 4,
            "title": "霸道总裁爱上我",
            "media_type": "movie",
            "genre_ids": [10749],  # Romance
            "vote_average": 7.2,
            "vote_count": 2000,
            "overview": "Chinese romantic drama",
            "origin_country": ["CN"],
            "backdrop_path": "/sample4.jpg"
        }
    ]
    
    print(f"📋 Original sample data: {len(sample_movies)} items")
    for movie in sample_movies:
        print(f"  • {movie['title']} (Rating: {movie['vote_average']})")
    
    # Apply content filtering
    print("\n🔍 Applying content filters...")
    filtered_movies = default_content_filter.filter_items(sample_movies)
    
    print(f"✅ After filtering: {len(filtered_movies)} items")
    for movie in filtered_movies:
        print(f"  • {movie['title']} (Rating: {movie['vote_average']})")
    
    # Get filter statistics
    filter_stats = default_content_filter.get_filter_stats(sample_movies)
    print(f"\n📊 Filter Statistics:")
    print(f"  Total items: {filter_stats['total_items']}")
    print(f"  Kept items: {filter_stats['kept_items']}")
    print(f"  Excluded items: {filter_stats['excluded_items']}")
    
    if filter_stats['exclusion_reasons']:
        print("  Exclusion reasons:")
        for reason, count in filter_stats['exclusion_reasons'].items():
            print(f"    - {reason}: {count} items")
    
    # Demonstrate Chinese content optimization
    print("\n🇨🇳 Applying Chinese content optimization...")
    optimized_movies = chinese_optimizer.prioritize_chinese_content(filtered_movies)
    
    print("✅ After Chinese optimization (Chinese content first):")
    for movie in optimized_movies:
        is_chinese = chinese_optimizer._is_chinese_content(movie)
        flag = "🇨🇳" if is_chinese else "🌍"
        print(f"  {flag} {movie['title']}")
    
    return filtered_movies


def demonstrate_image_processing():
    """Demonstrate advanced image processing"""
    print("\n" + "="*60)
    print("🖼️ IMAGE PROCESSING DEMONSTRATION")
    print("="*60)
    
    if not OPTIMIZATIONS_AVAILABLE:
        print("⚠ Image processing not available")
        return
    
    # Sample image URLs (these are example URLs)
    sample_image_urls = [
        "https://image.tmdb.org/t/p/w1280/sample1.jpg",
        "https://image.tmdb.org/t/p/w1280/sample2.jpg",
        "https://image.tmdb.org/t/p/w1280/sample3.jpg"
    ]
    
    print(f"📋 Sample image URLs: {len(sample_image_urls)} images")
    
    # Demonstrate different optimization configs
    print("\n🔧 Available optimization configurations:")
    for config_name, config in OPTIMIZATION_CONFIGS.items():
        print(f"  • {config_name}: {config.target_format.value}, "
              f"{config.compression_level.value} compression, "
              f"{config.max_width}x{config.max_height} max size")
    
    # Get processing statistics
    stats = global_image_processor.get_processing_stats()
    print(f"\n📊 Image Processing Statistics:")
    print(f"  Cache hits: {stats['cache_hits']}")
    print(f"  Total processed: {stats['total_processed']}")
    print(f"  Cache size: {stats['cache_size_mb']:.2f} MB")
    print(f"  Cached files: {stats['cached_files']}")
    
    if stats['total_processed'] > 0:
        print(f"  Average processing time: {stats['avg_processing_time']:.3f}s")
        print(f"  Bytes saved: {stats['bytes_saved'] / 1024:.1f} KB")


def demonstrate_title_overlays():
    """Demonstrate title overlay generation"""
    print("\n" + "="*60)
    print("🎨 TITLE OVERLAY DEMONSTRATION")
    print("="*60)
    
    if not OPTIMIZATIONS_AVAILABLE:
        print("⚠ Title overlay generation not available")
        return
    
    # Sample movie data for overlay generation
    sample_movie = {
        "id": 123,
        "title": "星际穿越",
        "backdrop_path": "/sample_backdrop.jpg",
        "vote_average": 8.6,
        "release_date": "2014-11-07",
        "genre_ids": [878, 18]  # Sci-Fi, Drama
    }
    
    print(f"🎬 Sample movie: {sample_movie['title']}")
    print(f"   Rating: ⭐ {sample_movie['vote_average']}")
    print(f"   Release: {sample_movie['release_date'][:4]}")
    
    # Show available overlay configurations
    print("\n🎨 Available overlay configurations:")
    for config_name, config in OVERLAY_CONFIGS.items():
        print(f"  • {config_name}: {config.position.value}, "
              f"{config.font_size}px, {config.text_style.value}")
    
    print("\n💡 Title overlay generation would create backdrop images with:")
    print("  • Movie title overlaid on backdrop")
    print("  • Rating, year, and genre information")
    print("  • Customizable positioning and styling")
    print("  • Multiple format support (PNG, JPEG, WEBP)")
    print("  • Background overlays and text effects")


def demonstrate_health_monitoring():
    """Demonstrate health monitoring and recovery"""
    print("\n" + "="*60)
    print("🏥 HEALTH MONITORING DEMONSTRATION")
    print("="*60)
    
    if not OPTIMIZATIONS_AVAILABLE:
        print("⚠ Health monitoring not available")
        return
    
    print("🔍 Running comprehensive health check...")
    
    # Run health check
    health_results = global_health_monitor.run_health_check()
    
    print(f"✅ Health check completed for {len(health_results)} components")
    
    # Show results for each component
    for component, result in health_results.items():
        status_emoji = {
            "healthy": "✅",
            "warning": "⚠️",
            "critical": "❌",
            "unknown": "❓"
        }.get(result.status.value, "❓")
        
        print(f"\n{status_emoji} {component.upper()}: {result.status.value}")
        
        if result.issues:
            for issue in result.issues:
                severity_emoji = {
                    "healthy": "✅",
                    "warning": "⚠️", 
                    "critical": "❌",
                    "unknown": "❓"
                }.get(issue.severity.value, "❓")
                print(f"    {severity_emoji} {issue.description}")
        else:
            print("    No issues detected")
        
        # Show key metrics
        if result.metrics:
            key_metrics = {}
            for key, value in result.metrics.items():
                if isinstance(value, (int, float)) and not isinstance(value, bool):
                    if 'rate' in key or 'ratio' in key:
                        key_metrics[key] = f"{value:.1%}" if value <= 1 else f"{value:.2f}"
                    elif 'time' in key and value < 10:
                        key_metrics[key] = f"{value:.3f}s"
                    elif 'mb' in key or 'gb' in key:
                        key_metrics[key] = f"{value:.2f}"
                    elif isinstance(value, int):
                        key_metrics[key] = str(value)
            
            if key_metrics:
                metrics_str = ", ".join([f"{k}: {v}" for k, v in list(key_metrics.items())[:3]])
                print(f"    📊 {metrics_str}")
    
    # Get overall health summary
    overall_health = global_health_monitor.get_overall_health()
    print(f"\n🏥 OVERALL SYSTEM HEALTH: {overall_health['overall_status'].upper()}")
    print(f"   Components: {overall_health['healthy_components']}✅ "
          f"{overall_health['warning_components']}⚠️ "
          f"{overall_health['critical_components']}❌")
    
    if overall_health['active_issues'] > 0:
        print(f"   Active issues: {overall_health['active_issues']}")
        if overall_health['issue_breakdown']:
            print("   Issue types:", ", ".join(overall_health['issue_breakdown'].keys()))


def demonstrate_cache_system():
    """Demonstrate advanced caching system"""
    print("\n" + "="*60)
    print("🗄️ ADVANCED CACHING DEMONSTRATION")
    print("="*60)
    
    if not OPTIMIZATIONS_AVAILABLE:
        print("⚠ Advanced caching not available")
        return
    
    # Get cache statistics
    cache_stats = cache_manager.get_all_stats()
    
    print("📊 Cache System Statistics:")
    
    total_items = 0
    total_hits = 0
    total_requests = 0
    
    for cache_type, stats in cache_stats.items():
        current_size = stats.get('current_size', 0)
        hits = stats.get('hits', 0)
        total_reqs = stats.get('total_requests', 0)
        hit_rate = stats.get('hit_rate', 0)
        
        total_items += current_size
        total_hits += hits
        total_requests += total_reqs
        
        if current_size > 0 or total_reqs > 0:
            print(f"\n  🗂️ {cache_type.upper()}:")
            print(f"     Items: {current_size}")
            print(f"     Requests: {total_reqs}")
            print(f"     Hit rate: {hit_rate:.1%}")
            print(f"     Fill ratio: {stats.get('fill_ratio', 0):.1%}")
    
    if total_requests > 0:
        overall_hit_rate = total_hits / total_requests
        print(f"\n📈 OVERALL CACHE PERFORMANCE:")
        print(f"   Total cached items: {total_items}")
        print(f"   Total requests: {total_requests}")
        print(f"   Overall hit rate: {overall_hit_rate:.1%}")
        print(f"   Cache efficiency: {'Excellent' if overall_hit_rate > 0.7 else 'Good' if overall_hit_rate > 0.5 else 'Fair'}")
    
    # Demonstrate cache cleanup
    print("\n🧹 Cache Cleanup:")
    cleanup_stats = cache_manager.cleanup_all_expired()
    
    total_cleaned = sum(cleanup_stats.values())
    if total_cleaned > 0:
        print(f"   Cleaned {total_cleaned} expired entries")
        for cache_type, count in cleanup_stats.items():
            if count > 0:
                print(f"     {cache_type}: {count} entries")
    else:
        print("   No expired entries found")


def main():
    """Main demonstration function"""
    print("🌟" * 30)
    print("🚀 TMDB CRAWLER OPTIMIZATION SHOWCASE")
    print("🌟" * 30)
    print("\nThis demonstration showcases advanced optimization features")
    print("inspired by the fw2.js implementation, including:")
    print("• Advanced LRU caching with TTL")
    print("• Concurrency management and rate limiting")
    print("• Content filtering and Chinese optimization")
    print("• Intelligent image processing")
    print("• Title overlay generation")
    print("• Health monitoring and auto-recovery")
    print("• CDN optimization and network resilience")
    
    try:
        # Run all demonstrations
        backdrop_movies = demonstrate_enhanced_tmdb_client()
        filtered_movies = demonstrate_content_filtering()
        demonstrate_image_processing()
        demonstrate_title_overlays()
        demonstrate_health_monitoring()
        demonstrate_cache_system()
        
        print("\n" + "🎉" * 30)
        print("✅ ALL OPTIMIZATIONS DEMONSTRATED SUCCESSFULLY!")
        print("🎉" * 30)
        
        # Summary
        print(f"\n📋 DEMONSTRATION SUMMARY:")
        print(f"   • Enhanced TMDB client with all optimizations enabled")
        print(f"   • Content filtering removed unwanted content types")
        print(f"   • Chinese content optimization prioritized relevant content")
        print(f"   • Image processing pipeline ready for optimization")
        print(f"   • Title overlay generation configured")
        print(f"   • Health monitoring system active")
        print(f"   • Advanced caching system operational")
        
        if OPTIMIZATIONS_AVAILABLE:
            print(f"\n🎯 KEY BENEFITS:")
            print(f"   • Faster response times through intelligent caching")
            print(f"   • Reduced API calls via concurrency management")
            print(f"   • Better content quality through filtering")
            print(f"   • Optimized images for different use cases")
            print(f"   • Automatic issue detection and recovery")
            print(f"   • Network-resilient CDN optimization")
        
    except Exception as e:
        print(f"\n❌ Demonstration error: {e}")
        print("This may be due to missing dependencies or configuration issues.")
        
        if not OPTIMIZATIONS_AVAILABLE:
            print("\n💡 To enable full optimizations:")
            print("   1. Install missing dependencies: pip install Pillow")
            print("   2. Set up TMDB API key in .env file")
            print("   3. Run the demonstration again")


if __name__ == "__main__":
    main()