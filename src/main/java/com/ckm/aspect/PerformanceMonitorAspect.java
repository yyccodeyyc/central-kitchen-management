package com.ckm.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 性能监控切面
 * 监控Service层和Controller层方法的执行时间和性能指标
 */
@Aspect
@Component
@Slf4j
public class PerformanceMonitorAspect {

    /**
     * Service层方法切点
     */
    @Pointcut("execution(* com.ckm.service.*.*(..))")
    public void serviceMethods() {}

    /**
     * Controller层方法切点
     */
    @Pointcut("execution(* com.ckm.controller.*.*(..))")
    public void controllerMethods() {}

    /**
     * Repository层方法切点
     */
    @Pointcut("execution(* com.ckm.repository.*.*(..))")
    public void repositoryMethods() {}

    /**
     * 监控Service层方法执行性能
     */
    @Around("serviceMethods()")
    public Object monitorServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorMethod(joinPoint, "SERVICE");
    }

    /**
     * 监控Controller层方法执行性能
     */
    @Around("controllerMethods()")
    public Object monitorControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorMethod(joinPoint, "CONTROLLER");
    }

    /**
     * 监控Repository层方法执行性能
     */
    @Around("repositoryMethods()")
    public Object monitorRepositoryMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorMethod(joinPoint, "REPOSITORY");
    }

    /**
     * 通用方法监控逻辑
     */
    private Object monitorMethod(ProceedingJoinPoint joinPoint, String layer) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = method.getName();
        Object[] args = joinPoint.getArgs();

        // 记录方法调用开始
        log.debug("[{}] {}.{}() - START - Args: {}",
                 layer, className, methodName,
                 args.length > 0 ? Arrays.toString(args) : "none");

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        Object result = null;
        try {
            // 执行目标方法
            result = joinPoint.proceed();

            // 记录执行时间
            stopWatch.stop();
            long executionTime = stopWatch.getTotalTimeMillis();

            // 根据执行时间记录不同级别日志
            if (executionTime > 5000) { // 超过5秒
                log.warn("[{}] {}.{}() - SLOW EXECUTION - Time: {}ms",
                        layer, className, methodName, executionTime);
            } else if (executionTime > 1000) { // 超过1秒
                log.info("[{}] {}.{}() - PERFORMANCE - Time: {}ms",
                        layer, className, methodName, executionTime);
            } else {
                log.debug("[{}] {}.{}() - COMPLETED - Time: {}ms",
                         layer, className, methodName, executionTime);
            }

            return result;

        } catch (Exception e) {
            stopWatch.stop();
            long executionTime = stopWatch.getTotalTimeMillis();

            log.error("[{}] {}.{}() - ERROR - Time: {}ms - Exception: {}",
                     layer, className, methodName, executionTime, e.getMessage(), e);

            throw e;
        }
    }
}
