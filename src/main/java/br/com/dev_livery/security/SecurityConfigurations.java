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
                .csrf(csrf -> csrf.disable()) // Desabilita proteção CSRF (padrão em APIs REST)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API sem estado (usa JWT)
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

                        // 2. CADASTROS E LOGIN (Tudo Público)
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clientes/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/entregadores/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/parceiros/cadastro").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/restaurantes/cadastro").permitAll()

                        // 3. O SEGREDO ESTÁ AQUI: VISUALIZAÇÃO PÚBLICA (Qualquer usuário pode ver lista e menu)
                        .requestMatchers(HttpMethod.GET, "/api/restaurantes").permitAll() // Vê a lista da página inicial
                        .requestMatchers(HttpMethod.GET, "/api/restaurantes/**").permitAll() // Vê os detalhes de 1 restaurante
                        .requestMatchers(HttpMethod.GET, "/api/produtos/restaurante/**").permitAll() // Vê o cardápio
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/relatorios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/entregadores/destaques").permitAll()
                        .requestMatchers("/api/home/**").permitAll()

                        .requestMatchers("/api/restaurantes/**").hasAnyRole("RESTAURANTE", "PARCEIRO")
                        .requestMatchers("/api/produtos/**").hasAnyRole("RESTAURANTE", "PARCEIRO")
                        .requestMatchers("/api/pedidos/restaurante/**").hasAnyRole("RESTAURANTE", "PARCEIRO")

                        // 4. AÇÕES RESTRITAS DE CLIENTE (Precisa estar logado)
                        .requestMatchers("/api/clientes/**").hasRole("CLIENTE")
                        .requestMatchers("/api/pedidos/**").hasRole("CLIENTE") // Só o cliente logado faz pedido

                        // 5. AÇÕES RESTRITAS DE ENTREGADOR
                        .requestMatchers("/api/entregadores/**").hasRole("ENTREGADOR")

                        // 6. AÇÕES RESTRITAS DE PARCEIROS E DONOS DE RESTAURANTES
                        .requestMatchers("/api/parceiros/**").hasRole("PARCEIRO")

                        // 7. QUALQUER OUTRA ROTA EXIGE ESTAR LOGADO
                        .anyRequest().authenticated()
                )
                // Coloca o nosso filtro de JWT antes do filtro padrão do Spring
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