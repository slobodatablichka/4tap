## Ordinary-app constraint

Android 4Tap — обычное пользовательское приложение на штатном Android.

Из активной архитектуры и roadmap исключены:
- изменение firmware/SystemUI;
- root и bootloader unlock;
- custom ROM / cross-flash;
- privileged/system app;
- обязательная OEM-интеграция;
- AOSP/Cuttlefish как путь реализации продукта.

Историческая SystemUI/AOSP ветвь хранится только как архив и не является вариантом следующего шага.

## Текущая версия

Интерактивная документация v0.5.

## Реализовано

- единая одностраничная карта KnockUI;
- разделы формируются из `data/sections.json`;
- точное место ячейки задаётся полями `section` и `order` в `data/cells.json`;
- охвачены Android, iOS, WeChat и WhatsApp;
- отражены B2C и B2B;
- добавлены региональная стратегия, roadmap и методология;
- каждая ячейка имеет интерактивное пояснение;
- подробная карточка показывает параметры, входы, выходы, ограничения и открытые вопросы;
- поиск по документации;
- фильтры по платформе и модели;
- фильтр по статусу;
- отдельный фильтр по результату технической проверки;
- типизированные видимые связи между ячейками (`flow / branch / model / constraint / strategy / roadmap / governance`);
- фильтр отображения связей;
- подписи активных связей;
- runtime-проверка ссылочной целостности графа;
- прямые URL на ячейки;
- матрица 1296 двухсимвольных комбинаций, включая пары из одинаковых символов.

## Редактирование

Схема содержательных файлов описана в `data/README.md`. Для добавления разделов, ячеек и связей менять HTML не требуется.

## Аудит полноты

Структурный аудит выполнен. Результаты и исправления зафиксированы в `AUDIT-2026-09-28.md`.

Состояние на момент аудита 2026-09-28:
- 50 ячеек;
- 79 связей;

Текущее состояние карты:
- 73 ячейки;
- 155 связей;
- roadmap развёрнут в шесть этапов: Android end-to-end → Product Canon → User Configuration → Integration Catalog → Launch/Monetization+B2B → Cross-platform;
- Android-поток дополнен разрешениями, валидацией зоны, fail-safe, обратной связью первого символа, хранилищем, редактором назначений, compliance и energy budget;
- iOS и WeChat имеют явные action-узлы;
- общие продуктовые принципы связаны с платформенными адаптациями;
- браузер проверяет несуществующие ссылки, дубликаты, неизвестные section/status/type и изолированные ячейки.

## Техническая верификация

Выполнена первая платформенная техническая проверка. Полный результат: `TECH-VERIFICATION-2026-09-28.md`.

Ключевые результаты:
- вывод проверки 2026-09-28 о пассивном raw-touch «где угодно» сохраняется только для того сценария; 2026-09-29 конкретный navigation-bar trigger через `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` подтверждён на физическом устройстве и снимает его как blocker текущего 4Tap flow;
- `TYPE_APPLICATION_OVERLAY` и permission flow подтверждены как рабочая технология для локального overlay после активации;
- универсальное определение «пустой/неактивной» точки в чужом приложении не может считаться гарантированным;
- Android intents/deep links подтверждены с ограничениями background activity launch и resolver;
- требования Google Play к AccessibilityService и package visibility внесены в документацию;
- $1 Recognizer оставлен как технически реальный MVP-кандидат, но качество на 36 символах требует собственного прототипа;
- iOS Custom Keyboard подтверждён как ограниченная input surface; App Review Guideline 4.4.1 блокирует запуск произвольных приложений из keyboard extension;
- WeChat Mini Program подтверждён как локальная/contained среда, не глобальный OS-layer;
- WhatsApp Cloud API подтверждает чатовый command/response transport через webhooks;
- рыночные тезисы вынесены из технической проверки.

На карте появился отдельный узел `android-global-trigger-limitation`, а вводящая в заблуждение прямая flow-связь `android-integration → android-quad-tap` удалена.

## Следующий этап

Первый Android end-to-end рубеж пройден на `LGM-V300L / Android 9`:

`другое приложение → 4 тапа в LEFT/RIGHT области navigation bar → KnockUI → S → C → SC → Android Settings`.

Текущий trigger использует `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY`; после успешной активации зоны автоматически перевооружаются. ADB/debug broadcast для пользовательской цепочки не требуется.

Ближайшие задачи:
1. сохранить этот рабочий механизм как baseline;
2. спроектировать понятный onboarding для двух текущих user grants: Accessibility и «Поверх других приложений»;
3. проверить возможность сократить onboarding до одного разрешения;
4. подготовить Google Play Accessibility declaration / prominent disclosure / consent / review video и advance notice;
5. повторить механизм на более новых stock Android-устройствах.

## Полнота технических выводов

Все выводы технической проверки разнесены по интерактивным ячейкам, а не оставлены только в TECH-VERIFICATION-2026-09-28.md.

Дополнительно введены архитектурные узлы:
- `platform-adaptation-model` — общий протокол при разных platform entry/action models;
- `android-activation-redesign` — обязательное решение по замене пассивного глобального trigger;
- `ios-action-redesign` — обязательное решение по iOS execution model.

В `verification` соответствующих ячеек теперь фиксируются не только summary/sources/next_step, но и `implication` — архитектурное следствие. Для WeChat также фиксируется `source_note` о необходимости финальной перепроверки по актуальной официальной документации/DevTools.


## Android activation strategy — ordinary app

Подтверждённая текущая модель:

- 4Tap остаётся обычным приложением на штатном Android;
- пользователь выполняет 4 быстрых тапа в LEFT/RIGHT области navigation bar; продуктовый порог по-прежнему рассматривается как 3/4;
- `AccessibilityService` размещает две небольшие touchable `TYPE_ACCESSIBILITY_OVERLAY` зоны в navigation bar;
- полная последовательность формирует `ActivationRequest`;
- после запуска KnockUI trigger-зоны автоматически перевооружаются;
- SystemUI/AOSP/root/privileged/OEM-only пути исключены;
- Accessibility shortcut не используется.

На LG V30 механизм работает стабильно; LG-specific geometry остаётся только диагностическим baseline.

## Android runtime constraints

В публичной карте обновлён узел `android-runtime-constraints`.

Текущий prototype использует два user-granted capability:
- `AccessibilityService + TYPE_ACCESSIBILITY_OVERLAY` — navigation-bar trigger;
- `SYSTEM_ALERT_WINDOW + TYPE_APPLICATION_OVERLAY` — KnockUI поверх текущего приложения.

AccessibilityService в текущем prototype использует `canRetrieveWindowContent=false` и не читает содержимое экранов.

Google Play допускает AccessibilityService и для приложений, не являющихся accessibility tools, но требует declaration, prominent in-app disclosure, affirmative consent и review. Для приложения с AccessibilityService доступен advance notice App Review.

Два системных подтверждения — текущий UX/compliance риск, а не технический blocker. Отдельно проверяется возможность сократить onboarding до одного user grant.

Остальные runtime-ограничения сохраняются: чувствительные экраны могут скрывать application overlay; запуск действий зависит от background-launch rules и intent/deep-link contracts; Settings Console учитывает package visibility.

## Android navigation-bar activation — PASS 2026-09-29

На физическом `LGM-V300L / Android 9` устойчиво подтверждено:

- Accessibility service `4Tap corner activation` включён пользователем;
- real display `1440×2880`, usable `1440×2733`, navigation bar height `147 px`;
- LEFT zone `(0,2712)`, RIGHT zone `(1104,2712)`, size `336×168 px`;
- обе зоны перекрывают navigation bar `Y=2733…2880`;
- 4 быстрых тапа LEFT/RIGHT стабильно запускают KnockUI;
- `S → C → SC` открывает Android Settings;
- после успешного запуска trigger-зоны автоматически re-arm через 700 ms;
- повторные циклы работают без перевключения AccessibilityService.

Предшествующий `ACTION_OUTSIDE` watcher признан непригодным для угловой фильтрации на LG: события приходили, но координаты тапа были `(0,0)`.

Текущий результат закрывает Stage 1 feasibility, но не утверждает финальную permission architecture.

## Android post-activation drawing

Зафиксировано отдельное техническое положение:
- сложность глобального вызова KnockUI не переносится автоматически на последующее рисование;
- после активации можно использовать небольшой временный touchable `TYPE_APPLICATION_OVERLAY`;
- overlay принимает штрихи KnockUI внутри своей области;
- нижележащее приложение в пределах canvas во время ввода не получает эти касания;
- pass-through для gesture canvas не требуется;
- ограничения Android 12 на untrusted pass-through поэтому не блокируют эту схему.

Добавлена ячейка `android-drawing-overlay`. Основной input flow теперь проходит через неё: `Local Canvas → Drawing Overlay Surface → Gesture 1`.


## Android overlay over WeChat / WhatsApp

Зафиксирована двухконтурная модель:
- на Android после успешной активации 4Tap может открыть временный Drawing Overlay Surface поверх текущего foreground app, в том числе поверх WeChat и WhatsApp;
- одновременно сохраняются собственные внутренние KnockUI-пути: WeChat Mini Program и WhatsApp Business/chat transport;
- эти пути независимы и не заменяют друг друга;
- данное решение относится к Android; iOS рассматривается отдельно.

Добавлена ячейка `android-overlay-over-host-apps`.



## Android prototype baseline

Получен первый подтверждённый результат рабочей реализации `4tap-app`:
- минимальный Android-проект создан и успешно собирается;
- debug APK установлен на физическое Android-устройство;
- приложение успешно запущено;
- контрольный экран `4Tap / KnockUI — RUNNING` подтверждён на устройстве.

Этот результат подтверждает только рабочий Android application baseline. Активация KnockUI, Quad Tap, Drawing Overlay Surface и распознавание жестов ещё не реализованы.

Следующий практический шаг: touch-диагностика и минимальная поверхность ввода, затем распознавание эталонных одноштриховых `S` и `C`.


## Android touch prototype

В рабочем репозитории `4tap-app` подтверждён следующий практический рубеж:
- минимальная touch-поверхность работает на физическом Android-устройстве;
- отображается реальная траектория пальца;
- фиксируются touch events, координаты и тайминги;
- результат подтверждён как `TOUCH OK`.

Следующий prototype subset — только оригинальные Palm Graffiti `S` и `C`. Минимальный направленно-чувствительный распознаватель для этих двух знаков уже реализован в коде и ожидает проверки на физическом устройстве.


## Android SC prototype

В рабочем `4tap-app` подтверждён первый жестовый результат на физическом Android-устройстве:
- touch-поверхность работает;
- оригинальный Palm Graffiti `S` распознаётся;
- оригинальный Palm Graffiti `C` распознаётся;
- последовательность `S → C` корректно формирует команду `SC`.

Это ограниченная верификация только двух эталонов и одной тестовой команды. Она не подтверждает качество полного алфавита A–Z / 0–9.

Следующий практический шаг — перенести уже работающий ввод в post-activation KnockUI flow с временной локальной поверхностью, сохранив диагностику.


## Android in-app end-to-end prototype

На физическом Android-устройстве подтверждена ограниченная сквозная цепочка внутри launcher Activity:
- левый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- правый нижний угол → четыре тапа → локальный canvas → Palm Graffiti `S` → `C` → команда `SC`;
- после завершения canvas закрывается и последняя команда сохраняется на экране ожидания.

Результат зафиксирован как `LEFT SC OK`, `RIGHT SC OK`.

Граница подтверждения принципиальна: угловые зоны и canvas пока находятся внутри самого 4Tap-приложения. Это проверяет UX/тайминги/распознавание и внутреннюю композицию цепочки, но не доказывает глобальный Android/OEM Quad Tap и не является проверкой `TYPE_APPLICATION_OVERLAY` поверх чужого приложения.

Следующий Android-эксперимент — настоящий временный touchable overlay с тем же подтверждённым `S → C → SC`.


## Android overlay real-device verification

Подтверждён post-activation drawing на физическом Android-устройстве:
- настоящий touchable `TYPE_APPLICATION_OVERLAY` создаётся после тестовой in-app активации;
- overlay остаётся поверх другого foreground-приложения;
- Palm Graffiti `S → C` распознаётся внутри overlay;
- команда `SC` формируется корректно;
- overlay автоматически закрывается после команды;
- сценарий подтверждён для левой и правой стороны: `LEFT OVERLAY SC OK`, `RIGHT OVERLAY SC OK`.

Это существенно сужает Android-риск: post-activation input surface и двухсимвольное распознавание подтверждены. Неподтверждённым остаётся системный/OEM activation trigger, который должен вызывать уже рабочий overlay без предварительного открытия 4Tap Activity.


## Android activation contract verified

После архитектурного разделения повторно подтверждён полный downstream-контур на физическом Android-устройстве:
- `ActivationRequest`;
- `OverlayLauncher`;
- настоящий `TYPE_APPLICATION_OVERLAY`;
- Palm Graffiti recognizer;
- двухсимвольная команда `SC`.

Контрольный результат: `REFACTOR LEFT SC OK`, `RIGHT SC OK`.

Это подтверждает, что источник активации можно менять независимо от overlay/recognizer/command. Текущий in-app 4-tap остаётся test harness. Неподтверждённым остаётся ordinary-app lower-corner trigger, который должен подать тот же `ActivationRequest`.


## Android external activation adapter verified

Подтверждён внешний debug activation adapter на физическом Android-устройстве без предварительного открытия 4Tap Activity:

- explicit broadcast формирует тестовый `ActivationRequest`;
- уже проверенный `OverlayLauncher` открывает настоящий Drawing Overlay поверх другого foreground-приложения;
- `S → C → SC` завершается корректно;
- подтверждены обе стороны: `OEM LEFT SC OK`, `OEM RIGHT SC OK`.

Несмотря на историческое имя `OEM_SYSTEMUI_TEST`, этот adapter является только test harness. Он не задаёт production-архитектуру и не означает зависимость от OEM/SystemUI.

Конкретный production trigger — ordinary-app 3/4-tap sequence в нижнем углу — ещё требует end-to-end проверки.

## Android command action verified

На штатном `LGM-V300L / Android 9` подтверждён следующий рубеж:
- внешний debug trigger формирует `ActivationRequest`;
- настоящий `TYPE_APPLICATION_OVERLAY` открывается поверх другой программы;
- `S → C` формирует `SC`;
- после завершения команды overlay закрывается;
- `SC` запускает назначенное тестовое действие `Settings.ACTION_SETTINGS`.

Таким образом, downstream теперь подтверждён до реального Android action execution:

`ActivationRequest → OverlayLauncher → Drawing Overlay → Recognizer → Command → Action`.

Единственный незакрытый риск Stage 1 — ordinary-app lower-corner 3/4-tap activation без ADB/debug broadcast.

## LG V30 raw touch baseline

Для основной опытной площадки определён touchscreen input-device:

- node: `/dev/input/event1`;
- name: `touch_dev`;
- property: `INPUT_PROP_DIRECT`;
- raw X: `0..1439`;
- raw Y: `0..2879`.

Raw coordinate space совпадает с physical display `1440 × 2880` один-к-одному. Поэтому дальнейшие system-corner tests можно фиксировать непосредственно в физических координатах экрана.

## LG V30 test geometry baseline

Для первой физической Android-площадки `LGM-V300L / Android 9 / V300L30p` зафиксирована текущая геометрия:

- display: `1440 × 2880 px`;
- physical density: `640 dpi`;
- override density: `560 dpi`;
- `NavigationBar`: `[0,2733][1440,2880]`;
- высота панели: `147 px`.

Это диагностический baseline конкретного LG. Эти значения не задают product trigger geometry и не используются как доказательство ownership.

## Android lower-corner activation — canon

Каноническая модель:

- 4Tap — ordinary user app;
- нижний LEFT и RIGHT угол дают целевую область вызова;
- активация — **3 или 4 быстрых тапа**;
- если 4Tap получает всю последовательность, формируется `ActivationRequest`;
- если один или несколько тапов не получены из-за активности приложения, системы или другого обработчика, серия сбрасывается и активация не происходит;
- такой отказ считается естественным ограничением конкретного контекста;
- не требуется отдельная модель ownership/passthrough/replay;
- `TYPE_APPLICATION_OVERLAY` используется только после активации как Drawing Overlay.

Текущая задача — проверить именно эту последовательность на физическом устройстве, а не исследовать SystemUI или точную границу NavigationBar.

## Android SystemUI Quad Tap zone — archived

Ранее исследованная reserved-zone/SystemUI/AOSP ветвь закрыта и сохранена только в истории проекта.

Она не является:
- текущей архитектурой;
- запасным implementation path;
- roadmap branch;
- способом исправлять неудачные угловые активации.

Пользовательский 4Tap должен оставаться обычным приложением на штатном Android.

## Product / UX plan update

В ближайший Android-контур добавлены обязательные продуктовые задачи:

- `4Tap Design Canon`: v0.1 до существенной переработки KnockUI overlay, v0.2 после первой полной real-device цепочки, v1.0 перед публичной beta;
- `4Tap Graffiti Profile`: Palm Graffiti остаётся baseline, но 4Tap утверждает собственные канонические формы; неудобные знаки могут меняться, символ `X` уже вынесен на отдельную проверку;
- `4Tap Settings Console`: установленные/доступные приложения, default-привязки, обучение написанию знаков, UserGestures и пользовательская привязка команды к приложению/действию;
- Settings Console должен поддерживать отдельный приватный профиль `Founder 40`; сами 40 сокращений не публикуются в публичной карте;
- `Default Integration Catalog — Russia`: сначала проверенный app launch, затем документированные deep links/actions;
- российский launch: RuStore как основной канал, другие Android-магазины и Google Play как дополнительные;
- monetization baseline: Free + Pro, subscription только за продолжающийся сервис, B2B/OEM отдельно, без рекламы внутри основного KnockUI-flow;
- продвижение — demo-first: короткая реальная цепочка «текущий контекст → 4Tap → два знака → действие».

Эти направления зафиксированы отдельными связанными ячейками карты и входят в roadmap, а не считаются пост-MVP неопределённостями.

## Current public-map alignment

Публичная карта синхронизирована с рабочим планом `4tap-app`:

- ближайший Android milestone: другая программа → 3/4 быстрых угловых тапа → KnockUI → `S → C → SC` → действие;
- Android activation описан как ordinary-app lower-corner sequence;
- неудачная/неполная tap sequence означает reset, а не переход к системной модификации;
- SystemUI/AOSP ветвь помечена архивной и удалена из активного roadmap-графа;
- Local Canvas связан с общим `ActivationRequest`;
- Design Canon, 4Tap Graffiti Profile, Settings Console, Founder 40 privacy rule и Russia Integration Catalog остаются в roadmap;
- RuStore остаётся primary Russia channel, Google Play и другие магазины — дополнительными;
- monetization и promotion сохранены отдельными продуктными узлами.

## Command Input / Command creation — утверждено 2026-10-01

После Destination v0.1 принят следующий связанный блок продуктовой модели:

- Command Space содержит 1296 пар `A–Z + 0–9`; одинаковые пары разрешены;
- в контуре `Commands` должно быть отдельное представление Command Space для занятых/свободных комбинаций; точная структура — следующий Design Canon-блок;
- новая команда создаётся в порядке `ADD COMMAND → Destination → рекомендации свободных XY → Command Input → Command`;
- существующая команда сохраняет независимое редактирование `XY` и `ВЕДЕТ В`;
- Command Input показывает 36 Graffiti-эталонов `6 × 6` с траекторией, кружком начала и стрелкой направления;
- занятость показывается заранее: до первого знака — доступность семейства `X?`, после первого — конкретных пар;
- оба слота XY можно повторно выбрать;
- нераспознанный штрих получает видимый аварийный feedback и объяснение перед очисткой;
- предложения похожих символов, tracing и учебное рисование поверх эталона предусмотрены на будущее, но в текущий блок не входят.

Следующий шаг: детально спроектировать Command Space в `Commands`, затем уточнить геометрию Command Input и рекомендации свободных XY.

## iOS implementation options

iOS больше не описывается как keyboard-only архитектура. Зафиксированы варианты реализации, окончательный выбор отложен.

Entry candidates:
- `Custom Keyboard Extension` — ввод внутри text-entry контекста;
- `Back Tap` — системный Double Tap/Triple Tap по задней панели с запуском Shortcut;
- `Action Button` — запуск Shortcut/Control на поддерживаемых моделях;
- `Control Center / Lock Screen Control` — WidgetKit Control.

Общий системный мост:
- `App Intents / Shortcuts Bridge` — связывает перечисленные системные triggers с действиями KnockUI.

Важно:
- эти механизмы не создают произвольный overlay поверх чужого iOS-приложения;
- часть App Intents может выполнять действие без отдельного UI, но это проверяется предметно для каждой команды;
- открытие приложения через intent/shortcut переводит пользователя в KnockUI app;
- конкретная комбинация entry/action paths пока не утверждена.

Добавлены ячейки `ios-back-tap`, `ios-action-button`, `ios-system-controls`, `ios-app-intents-shortcuts`. Ячейка `ios-activation` преобразована в общий узел вариантов.

## Accessibility-only KnockUI — PASS

2026-09-29 на `LGM-V300L / Android 9` подтверждена полная цепочка при выключенном системном доступе «Поверх других приложений»: `4 taps → AccessibilityService → TYPE_ACCESSIBILITY_OVERLAY KnockUI → S → C → SC → Settings`.

`SYSTEM_ALERT_WINDOW` затем полностью удалён из `AndroidManifest.xml`, сборка переустановлена и та же цепочка повторно прошла — PASS. Текущий Android-кандидат требует одного пользовательского системного включения: `4Tap corner activation` в Accessibility.
