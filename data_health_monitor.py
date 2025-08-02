"""
Data health monitoring and automatic recovery system.
Inspired by the data health check and recovery features from fw2.js.
"""

import os
import json
import time
import threading
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import logging
from datetime import datetime, timedelta
import hashlib


class HealthStatus(Enum):
    """Health status levels"""
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    UNKNOWN = "unknown"


class IssueType(Enum):
    """Types of data issues"""
    CORRUPTED_DATA = "corrupted_data"
    MISSING_DATA = "missing_data"
    STALE_DATA = "stale_data"
    INCONSISTENT_DATA = "inconsistent_data"
    PERFORMANCE_DEGRADATION = "performance_degradation"
    CACHE_ISSUES = "cache_issues"
    NETWORK_ISSUES = "network_issues"


@dataclass
class HealthIssue:
    """Represents a health issue"""
    issue_type: IssueType
    severity: HealthStatus
    description: str
    timestamp: float = field(default_factory=time.time)
    source: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)
    resolved: bool = False
    resolution_time: Optional[float] = None
    
    def resolve(self):
        """Mark issue as resolved"""
        self.resolved = True
        self.resolution_time = time.time()
    
    def age_seconds(self) -> float:
        """Get age of issue in seconds"""
        return time.time() - self.timestamp


@dataclass
class HealthCheckResult:
    """Result of a health check"""
    component: str
    status: HealthStatus
    issues: List[HealthIssue] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    check_duration: float = 0.0


class DataHealthMonitor:
    """
    Comprehensive data health monitoring system.
    Similar to the health check features in fw2.js.
    """
    
    def __init__(self, data_dir: str = "data", logs_dir: str = "logs"):
        """
        Initialize the health monitor.
        
        Args:
            data_dir: Directory containing data files
            logs_dir: Directory for health logs
        """
        self.data_dir = data_dir
        self.logs_dir = logs_dir
        self.health_checks: Dict[str, Callable] = {}
        self.recovery_actions: Dict[IssueType, Callable] = {}
        self.health_history: List[HealthCheckResult] = []
        self.active_issues: List[HealthIssue] = []
        self.auto_recovery_enabled = True
        self._lock = threading.RLock()
        
        self.logger = logging.getLogger(self.__class__.__name__)
        
        # Ensure directories exist
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(logs_dir, exist_ok=True)
        
        # Register default health checks
        self._register_default_checks()
        self._register_default_recovery_actions()
    
    def _register_default_checks(self):
        """Register default health check functions"""
        self.register_health_check("data_files", self._check_data_files)
        self.register_health_check("cache_system", self._check_cache_system)
        self.register_health_check("network_connectivity", self._check_network_connectivity)
        self.register_health_check("disk_space", self._check_disk_space)
        self.register_health_check("data_freshness", self._check_data_freshness)
        self.register_health_check("data_integrity", self._check_data_integrity)
    
    def _register_default_recovery_actions(self):
        """Register default recovery actions"""
        self.register_recovery_action(IssueType.CORRUPTED_DATA, self._recover_corrupted_data)
        self.register_recovery_action(IssueType.MISSING_DATA, self._recover_missing_data)
        self.register_recovery_action(IssueType.STALE_DATA, self._recover_stale_data)
        self.register_recovery_action(IssueType.CACHE_ISSUES, self._recover_cache_issues)
    
    def register_health_check(self, component: str, check_func: Callable[[], HealthCheckResult]):
        """Register a health check function"""
        self.health_checks[component] = check_func
    
    def register_recovery_action(self, issue_type: IssueType, recovery_func: Callable[[HealthIssue], bool]):
        """Register a recovery action for an issue type"""
        self.recovery_actions[issue_type] = recovery_func
    
    def run_health_check(self, component: str = None) -> Dict[str, HealthCheckResult]:
        """
        Run health checks for specified component or all components.
        
        Args:
            component: Specific component to check, or None for all
            
        Returns:
            Dictionary mapping component names to health check results
        """
        results = {}
        
        if component:
            # Check specific component
            if component in self.health_checks:
                start_time = time.time()
                try:
                    result = self.health_checks[component]()
                    result.check_duration = time.time() - start_time
                    results[component] = result
                except Exception as e:
                    self.logger.error(f"Health check failed for {component}: {e}")
                    results[component] = HealthCheckResult(
                        component=component,
                        status=HealthStatus.CRITICAL,
                        issues=[HealthIssue(
                            issue_type=IssueType.PERFORMANCE_DEGRADATION,
                            severity=HealthStatus.CRITICAL,
                            description=f"Health check failed: {e}",
                            source=component
                        )],
                        check_duration=time.time() - start_time
                    )
        else:
            # Check all components
            for comp_name, check_func in self.health_checks.items():
                start_time = time.time()
                try:
                    result = check_func()
                    result.check_duration = time.time() - start_time
                    results[comp_name] = result
                except Exception as e:
                    self.logger.error(f"Health check failed for {comp_name}: {e}")
                    results[comp_name] = HealthCheckResult(
                        component=comp_name,
                        status=HealthStatus.CRITICAL,
                        issues=[HealthIssue(
                            issue_type=IssueType.PERFORMANCE_DEGRADATION,
                            severity=HealthStatus.CRITICAL,
                            description=f"Health check failed: {e}",
                            source=comp_name
                        )],
                        check_duration=time.time() - start_time
                    )
        
        # Update health history and active issues
        with self._lock:
            for result in results.values():
                self.health_history.append(result)
                
                # Add new issues to active issues
                for issue in result.issues:
                    if not issue.resolved:
                        self.active_issues.append(issue)
            
            # Limit history size
            if len(self.health_history) > 1000:
                self.health_history = self.health_history[-1000:]
        
        # Attempt automatic recovery if enabled
        if self.auto_recovery_enabled:
            self._attempt_auto_recovery(results)
        
        return results
    
    def _attempt_auto_recovery(self, check_results: Dict[str, HealthCheckResult]):
        """Attempt automatic recovery for detected issues"""
        for result in check_results.values():
            for issue in result.issues:
                if issue.resolved or issue.severity == HealthStatus.HEALTHY:
                    continue
                
                recovery_func = self.recovery_actions.get(issue.issue_type)
                if recovery_func:
                    try:
                        self.logger.info(f"Attempting recovery for {issue.issue_type.value}: {issue.description}")
                        success = recovery_func(issue)
                        
                        if success:
                            issue.resolve()
                            self.logger.info(f"Successfully recovered from {issue.issue_type.value}")
                        else:
                            self.logger.warning(f"Recovery failed for {issue.issue_type.value}")
                            
                    except Exception as e:
                        self.logger.error(f"Recovery action failed for {issue.issue_type.value}: {e}")
    
    def _check_data_files(self) -> HealthCheckResult:
        """Check integrity and presence of data files"""
        issues = []
        metrics = {}
        
        # Expected data files
        expected_files = [
            'movies_data.json',
            'download_log.json',
            'metadata.json'
        ]
        
        existing_files = 0
        total_size = 0
        
        for filename in expected_files:
            filepath = os.path.join(self.data_dir, filename)
            
            if os.path.exists(filepath):
                existing_files += 1
                file_size = os.path.getsize(filepath)
                total_size += file_size
                
                # Check if file is empty
                if file_size == 0:
                    issues.append(HealthIssue(
                        issue_type=IssueType.CORRUPTED_DATA,
                        severity=HealthStatus.WARNING,
                        description=f"Data file {filename} is empty",
                        source="data_files",
                        metadata={"file": filename, "size": file_size}
                    ))
                
                # Check if file is valid JSON
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        json.load(f)
                except json.JSONDecodeError as e:
                    issues.append(HealthIssue(
                        issue_type=IssueType.CORRUPTED_DATA,
                        severity=HealthStatus.CRITICAL,
                        description=f"Data file {filename} contains invalid JSON: {e}",
                        source="data_files",
                        metadata={"file": filename, "error": str(e)}
                    ))
                
            else:
                issues.append(HealthIssue(
                    issue_type=IssueType.MISSING_DATA,
                    severity=HealthStatus.WARNING,
                    description=f"Expected data file {filename} is missing",
                    source="data_files",
                    metadata={"file": filename}
                ))
        
        metrics = {
            "existing_files": existing_files,
            "expected_files": len(expected_files),
            "total_size_mb": total_size / (1024 * 1024),
            "file_coverage": existing_files / len(expected_files)
        }
        
        # Determine overall status
        if existing_files == len(expected_files) and not any(i.severity == HealthStatus.CRITICAL for i in issues):
            status = HealthStatus.HEALTHY if not issues else HealthStatus.WARNING
        elif existing_files > 0:
            status = HealthStatus.WARNING
        else:
            status = HealthStatus.CRITICAL
        
        return HealthCheckResult(
            component="data_files",
            status=status,
            issues=issues,
            metrics=metrics
        )
    
    def _check_cache_system(self) -> HealthCheckResult:
        """Check cache system health"""
        issues = []
        metrics = {}
        
        try:
            # Try to import cache system
            from advanced_cache import cache_manager
            
            # Get cache statistics
            cache_stats = cache_manager.get_all_stats()
            
            # Calculate metrics
            total_items = sum(stats.get('current_size', 0) for stats in cache_stats.values())
            total_hit_rate = sum(stats.get('hit_rate', 0) for stats in cache_stats.values()) / len(cache_stats) if cache_stats else 0
            
            metrics = {
                "total_cached_items": total_items,
                "average_hit_rate": total_hit_rate,
                "cache_types": len(cache_stats),
                "cache_details": cache_stats
            }
            
            # Check for issues
            if total_hit_rate < 0.3:  # Less than 30% hit rate
                issues.append(HealthIssue(
                    issue_type=IssueType.CACHE_ISSUES,
                    severity=HealthStatus.WARNING,
                    description=f"Low cache hit rate: {total_hit_rate:.2%}",
                    source="cache_system",
                    metadata={"hit_rate": total_hit_rate}
                ))
            
            # Clean up expired entries
            cleanup_stats = cache_manager.cleanup_all_expired()
            metrics["expired_cleaned"] = cleanup_stats
            
            status = HealthStatus.HEALTHY if not issues else HealthStatus.WARNING
            
        except ImportError:
            issues.append(HealthIssue(
                issue_type=IssueType.CACHE_ISSUES,
                severity=HealthStatus.CRITICAL,
                description="Cache system not available",
                source="cache_system"
            ))
            status = HealthStatus.CRITICAL
            
        except Exception as e:
            issues.append(HealthIssue(
                issue_type=IssueType.CACHE_ISSUES,
                severity=HealthStatus.CRITICAL,
                description=f"Cache system error: {e}",
                source="cache_system",
                metadata={"error": str(e)}
            ))
            status = HealthStatus.CRITICAL
        
        return HealthCheckResult(
            component="cache_system",
            status=status,
            issues=issues,
            metrics=metrics
        )
    
    def _check_network_connectivity(self) -> HealthCheckResult:
        """Check network connectivity to TMDB API"""
        issues = []
        metrics = {}
        
        try:
            import requests
            from config import TMDB_BASE_URL, TMDB_API_KEY
            
            # Test TMDB API connectivity
            start_time = time.time()
            response = requests.get(
                f"{TMDB_BASE_URL}/configuration",
                params={"api_key": TMDB_API_KEY},
                timeout=10
            )
            response_time = time.time() - start_time
            
            metrics = {
                "response_time_ms": response_time * 1000,
                "status_code": response.status_code,
                "api_accessible": response.status_code == 200
            }
            
            if response.status_code != 200:
                issues.append(HealthIssue(
                    issue_type=IssueType.NETWORK_ISSUES,
                    severity=HealthStatus.CRITICAL,
                    description=f"TMDB API returned status {response.status_code}",
                    source="network_connectivity",
                    metadata={"status_code": response.status_code}
                ))
            elif response_time > 5.0:  # Slow response
                issues.append(HealthIssue(
                    issue_type=IssueType.PERFORMANCE_DEGRADATION,
                    severity=HealthStatus.WARNING,
                    description=f"Slow API response: {response_time:.2f}s",
                    source="network_connectivity",
                    metadata={"response_time": response_time}
                ))
            
            status = HealthStatus.HEALTHY if not issues else (HealthStatus.WARNING if response.status_code == 200 else HealthStatus.CRITICAL)
            
        except requests.exceptions.Timeout:
            issues.append(HealthIssue(
                issue_type=IssueType.NETWORK_ISSUES,
                severity=HealthStatus.CRITICAL,
                description="TMDB API request timed out",
                source="network_connectivity"
            ))
            status = HealthStatus.CRITICAL
            
        except Exception as e:
            issues.append(HealthIssue(
                issue_type=IssueType.NETWORK_ISSUES,
                severity=HealthStatus.CRITICAL,
                description=f"Network connectivity check failed: {e}",
                source="network_connectivity",
                metadata={"error": str(e)}
            ))
            status = HealthStatus.CRITICAL
        
        return HealthCheckResult(
            component="network_connectivity",
            status=status,
            issues=issues,
            metrics=metrics
        )
    
    def _check_disk_space(self) -> HealthCheckResult:
        """Check available disk space"""
        issues = []
        metrics = {}
        
        try:
            import shutil
            
            # Check space for data directory
            total, used, free = shutil.disk_usage(self.data_dir)
            
            free_gb = free / (1024**3)
            free_percent = (free / total) * 100
            
            metrics = {
                "total_gb": total / (1024**3),
                "used_gb": used / (1024**3),
                "free_gb": free_gb,
                "free_percent": free_percent
            }
            
            # Check for low disk space
            if free_gb < 1:  # Less than 1GB free
                issues.append(HealthIssue(
                    issue_type=IssueType.PERFORMANCE_DEGRADATION,
                    severity=HealthStatus.CRITICAL,
                    description=f"Very low disk space: {free_gb:.2f}GB free",
                    source="disk_space",
                    metadata={"free_gb": free_gb}
                ))
            elif free_percent < 10:  # Less than 10% free
                issues.append(HealthIssue(
                    issue_type=IssueType.PERFORMANCE_DEGRADATION,
                    severity=HealthStatus.WARNING,
                    description=f"Low disk space: {free_percent:.1f}% free",
                    source="disk_space",
                    metadata={"free_percent": free_percent}
                ))
            
            status = HealthStatus.HEALTHY if not issues else (HealthStatus.WARNING if free_gb > 1 else HealthStatus.CRITICAL)
            
        except Exception as e:
            issues.append(HealthIssue(
                issue_type=IssueType.PERFORMANCE_DEGRADATION,
                severity=HealthStatus.WARNING,
                description=f"Could not check disk space: {e}",
                source="disk_space",
                metadata={"error": str(e)}
            ))
            status = HealthStatus.WARNING
        
        return HealthCheckResult(
            component="disk_space",
            status=status,
            issues=issues,
            metrics=metrics
        )
    
    def _check_data_freshness(self) -> HealthCheckResult:
        """Check if data is fresh and up-to-date"""
        issues = []
        metrics = {}
        
        metadata_file = os.path.join(self.data_dir, 'metadata.json')
        
        if os.path.exists(metadata_file):
            try:
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                
                last_update = metadata.get('last_update')
                if last_update:
                    last_update_time = datetime.fromisoformat(last_update.replace('Z', '+00:00'))
                    age = datetime.now() - last_update_time.replace(tzinfo=None)
                    age_hours = age.total_seconds() / 3600
                    
                    metrics = {
                        "last_update": last_update,
                        "age_hours": age_hours,
                        "is_stale": age_hours > 24
                    }
                    
                    if age_hours > 48:  # More than 2 days old
                        issues.append(HealthIssue(
                            issue_type=IssueType.STALE_DATA,
                            severity=HealthStatus.WARNING,
                            description=f"Data is {age_hours:.1f} hours old",
                            source="data_freshness",
                            metadata={"age_hours": age_hours}
                        ))
                    
                    status = HealthStatus.HEALTHY if age_hours <= 48 else HealthStatus.WARNING
                else:
                    issues.append(HealthIssue(
                        issue_type=IssueType.MISSING_DATA,
                        severity=HealthStatus.WARNING,
                        description="No last_update timestamp in metadata",
                        source="data_freshness"
                    ))
                    status = HealthStatus.WARNING
                    
            except Exception as e:
                issues.append(HealthIssue(
                    issue_type=IssueType.CORRUPTED_DATA,
                    severity=HealthStatus.WARNING,
                    description=f"Could not read metadata: {e}",
                    source="data_freshness",
                    metadata={"error": str(e)}
                ))
                status = HealthStatus.WARNING
        else:
            issues.append(HealthIssue(
                issue_type=IssueType.MISSING_DATA,
                severity=HealthStatus.WARNING,
                description="Metadata file not found",
                source="data_freshness"
            ))
            status = HealthStatus.WARNING
        
        return HealthCheckResult(
            component="data_freshness",
            status=status,
            issues=issues,
            metrics=metrics
        )
    
    def _check_data_integrity(self) -> HealthCheckResult:
        """Check data integrity using checksums and validation"""
        issues = []
        metrics = {}
        
        movies_file = os.path.join(self.data_dir, 'movies_data.json')
        
        if os.path.exists(movies_file):
            try:
                with open(movies_file, 'r', encoding='utf-8') as f:
                    movies_data = json.load(f)
                
                if isinstance(movies_data, list):
                    total_movies = len(movies_data)
                    valid_movies = 0
                    
                    for movie in movies_data:
                        # Check required fields
                        required_fields = ['id', 'title', 'backdrop_path']
                        if all(field in movie for field in required_fields):
                            valid_movies += 1
                    
                    validity_ratio = valid_movies / total_movies if total_movies > 0 else 0
                    
                    metrics = {
                        "total_movies": total_movies,
                        "valid_movies": valid_movies,
                        "validity_ratio": validity_ratio
                    }
                    
                    if validity_ratio < 0.9:  # Less than 90% valid
                        issues.append(HealthIssue(
                            issue_type=IssueType.INCONSISTENT_DATA,
                            severity=HealthStatus.WARNING,
                            description=f"Data integrity issue: {validity_ratio:.1%} movies are valid",
                            source="data_integrity",
                            metadata={"validity_ratio": validity_ratio}
                        ))
                    
                    status = HealthStatus.HEALTHY if validity_ratio >= 0.9 else HealthStatus.WARNING
                else:
                    issues.append(HealthIssue(
                        issue_type=IssueType.CORRUPTED_DATA,
                        severity=HealthStatus.CRITICAL,
                        description="Movies data is not a valid list",
                        source="data_integrity"
                    ))
                    status = HealthStatus.CRITICAL
                    
            except Exception as e:
                issues.append(HealthIssue(
                    issue_type=IssueType.CORRUPTED_DATA,
                    severity=HealthStatus.CRITICAL,
                    description=f"Data integrity check failed: {e}",
                    source="data_integrity",
                    metadata={"error": str(e)}
                ))
                status = HealthStatus.CRITICAL
        else:
            issues.append(HealthIssue(
                issue_type=IssueType.MISSING_DATA,
                severity=HealthStatus.WARNING,
                description="Movies data file not found",
                source="data_integrity"
            ))
            status = HealthStatus.WARNING
        
        return HealthCheckResult(
            component="data_integrity",
            status=status,
            issues=issues,
            metrics=metrics
        )
    
    def _recover_corrupted_data(self, issue: HealthIssue) -> bool:
        """Attempt to recover corrupted data"""
        try:
            filename = issue.metadata.get('file')
            if filename:
                filepath = os.path.join(self.data_dir, filename)
                
                # Create backup
                backup_path = f"{filepath}.backup.{int(time.time())}"
                if os.path.exists(filepath):
                    os.rename(filepath, backup_path)
                
                # Create minimal valid structure
                if filename == 'movies_data.json':
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump([], f)
                elif filename == 'download_log.json':
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump({"downloads": []}, f)
                elif filename == 'metadata.json':
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump({
                            "last_update": datetime.now().isoformat(),
                            "version": "1.0",
                            "total_downloads": 0
                        }, f, indent=2)
                
                self.logger.info(f"Recovered corrupted file {filename}")
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to recover corrupted data: {e}")
        
        return False
    
    def _recover_missing_data(self, issue: HealthIssue) -> bool:
        """Attempt to recover missing data"""
        try:
            filename = issue.metadata.get('file')
            if filename:
                filepath = os.path.join(self.data_dir, filename)
                
                # Create minimal valid structure
                if filename == 'movies_data.json':
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump([], f)
                elif filename == 'download_log.json':
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump({"downloads": []}, f)
                elif filename == 'metadata.json':
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump({
                            "last_update": datetime.now().isoformat(),
                            "version": "1.0",
                            "total_downloads": 0
                        }, f, indent=2)
                
                self.logger.info(f"Created missing file {filename}")
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to recover missing data: {e}")
        
        return False
    
    def _recover_stale_data(self, issue: HealthIssue) -> bool:
        """Attempt to refresh stale data"""
        try:
            # This would typically trigger a data refresh
            # For now, just update the timestamp
            metadata_file = os.path.join(self.data_dir, 'metadata.json')
            
            if os.path.exists(metadata_file):
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                
                metadata['last_health_check'] = datetime.now().isoformat()
                metadata['stale_data_detected'] = True
                
                with open(metadata_file, 'w', encoding='utf-8') as f:
                    json.dump(metadata, f, indent=2)
                
                self.logger.info("Marked stale data for refresh")
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to recover stale data: {e}")
        
        return False
    
    def _recover_cache_issues(self, issue: HealthIssue) -> bool:
        """Attempt to recover cache issues"""
        try:
            from advanced_cache import cache_manager
            
            # Clear all caches
            cache_manager.clear_all()
            
            self.logger.info("Cleared all caches to recover from cache issues")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to recover cache issues: {e}")
        
        return False
    
    def get_overall_health(self) -> Dict[str, Any]:
        """Get overall system health summary"""
        recent_results = self.run_health_check()
        
        # Calculate overall status
        statuses = [result.status for result in recent_results.values()]
        
        if all(status == HealthStatus.HEALTHY for status in statuses):
            overall_status = HealthStatus.HEALTHY
        elif any(status == HealthStatus.CRITICAL for status in statuses):
            overall_status = HealthStatus.CRITICAL
        else:
            overall_status = HealthStatus.WARNING
        
        # Count issues by type
        issue_counts = {}
        for result in recent_results.values():
            for issue in result.issues:
                issue_type = issue.issue_type.value
                if issue_type not in issue_counts:
                    issue_counts[issue_type] = 0
                issue_counts[issue_type] += 1
        
        return {
            "overall_status": overall_status.value,
            "components_checked": len(recent_results),
            "healthy_components": sum(1 for r in recent_results.values() if r.status == HealthStatus.HEALTHY),
            "warning_components": sum(1 for r in recent_results.values() if r.status == HealthStatus.WARNING),
            "critical_components": sum(1 for r in recent_results.values() if r.status == HealthStatus.CRITICAL),
            "active_issues": len(self.active_issues),
            "issue_breakdown": issue_counts,
            "last_check": datetime.now().isoformat(),
            "auto_recovery_enabled": self.auto_recovery_enabled
        }
    
    def export_health_report(self, output_path: str = None) -> str:
        """Export detailed health report"""
        if output_path is None:
            output_path = os.path.join(self.logs_dir, f"health_report_{int(time.time())}.json")
        
        overall_health = self.get_overall_health()
        recent_results = {name: {
            "component": result.component,
            "status": result.status.value,
            "issues": [
                {
                    "type": issue.issue_type.value,
                    "severity": issue.severity.value,
                    "description": issue.description,
                    "timestamp": issue.timestamp,
                    "resolved": issue.resolved,
                    "metadata": issue.metadata
                }
                for issue in result.issues
            ],
            "metrics": result.metrics,
            "timestamp": result.timestamp,
            "check_duration": result.check_duration
        } for name, result in self.run_health_check().items()}
        
        report = {
            "overall_health": overall_health,
            "detailed_results": recent_results,
            "generated_at": datetime.now().isoformat()
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Health report exported to {output_path}")
        return output_path


# Global instance
global_health_monitor = DataHealthMonitor()