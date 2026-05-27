package br.com.dev_livery.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    private final SecurityFilter securityFilter;

    public SecurityConfigurations(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize

                        // 1. RECURSOS PÚBLICOS BÁSICOS (Telas HTML, CSS, JS, Imagens, Swagger)
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/",
                                "/*.html",
                                "/css/**",
                                "/js/**",
                                "/images/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/favicon.ico").permitAll()

                        // 2. CADASTROS E LOGIN (Público)
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clientes/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/entregadores/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/parceiros/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/restaurantes/cadastro").permitAll()

                        // 3. VISUALIZAÇÃO PÚBLICA (qualquer um pode ver lista, cardápio e detalhes)
                        .requestMatchers(HttpMethod.GET,  "/api/restaurantes").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/restaurantes/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/produtos/restaurante/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/relatorios/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/entregadores/destaques").permitAll()
                        .requestMatchers("/api/home/**").permitAll()

                        // 4. AÇÕES DO PARCEIRO — gerenciar restaurante, produtos e pedidos
                        .requestMatchers("/api/restaurantes/**").hasRole("PARCEIRO")
                        .requestMatchers("/api/produtos/**").hasRole("PARCEIRO")
                        .requestMatchers(HttpMethod.GET,  "/api/pedidos/restaurante/**").hasRole("PARCEIRO")
                        .requestMatchers(HttpMethod.PUT,  "/api/pedidos/*/status").hasRole("PARCEIRO")

                        // 5. AÇÕES DO CLIENTE — criar pedido, consultar os próprios pedidos
                        .requestMatchers("/api/clientes/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/api/pedidos").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.GET,  "/api/pedidos/cliente/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/api/pedidos/simular-desconto").hasRole("CLIENTE")

                        // 6. AÇÕES DO ENTREGADOR
                        .requestMatchers("/api/entregadores/**").hasRole("ENTREGADOR")
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/disponiveis-entrega").hasRole("ENTREGADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/pedidos/*/confirmar-entrega").hasRole("ENTREGADOR")

                        // 7. AÇÕES EXCLUSIVAS DO PARCEIRO (conta/perfil)
                        .requestMatchers("/api/parceiros/**").hasRole("PARCEIRO")

                        // 8. QUALQUER OUTRA ROTA EXIGE AUTENTICAÇÃO
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}